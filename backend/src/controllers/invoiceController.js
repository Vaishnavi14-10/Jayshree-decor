const { Op, fn, col, literal, where } = require('sequelize');
const { sequelize } = require('../config/sequelize');
const { Client, Invoice, InvoiceItem } = require('../models');
const { success, created, notFound, error } = require('../utils/response');
const { StatusCodes } = require('http-status-codes');
const logger = require('../utils/logger');

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calcTotals = (items, discountPercent = 0, taxPercent = 0) => {
  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.quantity) * parseFloat(i.rate), 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = afterDiscount * (taxPercent / 100);
  const grandTotal = afterDiscount + taxAmount;
  return {
    subtotal: +subtotal.toFixed(2),
    discountAmount: +discountAmount.toFixed(2),
    taxAmount: +taxAmount.toFixed(2),
    grandTotal: +grandTotal.toFixed(2),
  };
};

const upsertClient = async (t, { client_name, client_phone, client_address }) => {
  if (client_phone) {
    const existing = await Client.findOne({ where: { phone: client_phone }, transaction: t });
    if (existing) {
      await existing.update({ name: client_name, address: client_address }, { transaction: t });
      return existing;
    }
  }
  return Client.create({ name: client_name, phone: client_phone, address: client_address }, { transaction: t });
};

// ─── Controllers ─────────────────────────────────────────────────────────────

// GET /api/invoices
exports.getAllInvoices = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20, sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;

    const clientWhere = {};
    if (search) {
      clientWhere[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
      ];
      where[Op.or] = [
        { invoiceNumber: { [Op.iLike]: `%${search}%` } },
        { eventType: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const validSortFields = ['createdAt', 'invoiceDate', 'grandTotal', 'invoiceNumber', 'status'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'name', 'phone', 'address'],
        where: Object.keys(clientWhere).length ? clientWhere : undefined,
        required: Object.keys(clientWhere).length > 0,
      }],
      order: [[sortField, sortOrder]],
      limit: parseInt(limit),
      offset,
    });

    return success(res, {
      invoices: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices/meta/stats
exports.getStats = async (req, res, next) => {
  try {
    const [totals] = await sequelize.query(`
      SELECT
        COUNT(*)::int                                           AS total_invoices,
        COALESCE(SUM(grand_total), 0)::numeric                 AS total_revenue,
        COALESCE(SUM(CASE WHEN status='paid'     THEN grand_total ELSE 0 END), 0)::numeric AS paid_amount,
        COALESCE(SUM(CASE WHEN status='unpaid'   THEN grand_total ELSE 0 END), 0)::numeric AS unpaid_amount,
        COALESCE(SUM(CASE WHEN status='partial'  THEN grand_total ELSE 0 END), 0)::numeric AS partial_amount,
        COUNT(CASE WHEN status='paid'     THEN 1 END)::int     AS paid_count,
        COUNT(CASE WHEN status='unpaid'   THEN 1 END)::int     AS unpaid_count,
        COUNT(CASE WHEN status='cancelled' THEN 1 END)::int    AS cancelled_count
      FROM invoices
    `);

    const [monthly] = await sequelize.query(`
      SELECT
        TO_CHAR(invoice_date, 'Mon YYYY') AS month,
        COUNT(*)::int                     AS count,
        COALESCE(SUM(grand_total), 0)     AS revenue
      FROM invoices
      WHERE invoice_date >= NOW() - INTERVAL '6 months'
      GROUP BY TO_CHAR(invoice_date, 'Mon YYYY'), DATE_TRUNC('month', invoice_date)
      ORDER BY DATE_TRUNC('month', invoice_date) ASC
    `);

    return success(res, { summary: totals[0], monthly });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices/meta/next-number
exports.getNextNumber = async (req, res, next) => {
  try {
    const last = await Invoice.findOne({ order: [['id', 'DESC']] });
    let next = 'JD-001';
    if (last) {
      const num = parseInt(last.invoiceNumber.split('-')[1] || '0') + 1;
      next = `JD-${String(num).padStart(3, '0')}`;
    }
    return success(res, { invoice_number: next });
  } catch (err) {
    next(err);
  }
};

// GET /api/invoices/:id
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Client, as: 'client' },
        { model: InvoiceItem, as: 'items', order: [['id', 'ASC']] },
      ],
    });
    if (!invoice) return notFound(res, 'Invoice not found');
    return success(res, invoice);
  } catch (err) {
    next(err);
  }
};

// POST /api/invoices
exports.createInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      client_name, client_phone, client_address,
      event_type, invoice_number, invoice_date, event_date,
      discount_percent = 0, tax_percent = 0,
      notes, status = 'unpaid', items,
    } = req.body;

    // Upsert client
    const client = await upsertClient(t, { client_name, client_phone, client_address });

    // Calculate totals server-side (never trust client totals)
    const totals = calcTotals(items, parseFloat(discount_percent), parseFloat(tax_percent));

    // Create invoice
    const invoice = await Invoice.create({
      invoiceNumber: invoice_number,
      clientId: client.id,
      eventType: event_type,
      invoiceDate: invoice_date,
      eventDate: event_date || null,
      discountPercent: discount_percent,
      taxPercent: tax_percent,
      ...totals,
      notes,
      status,
    }, { transaction: t });

    // Bulk create items
    const itemsToCreate = items.map(item => ({
      invoiceId: invoice.id,
      category: item.category,
      description: item.description || null,
      quantity: parseFloat(item.quantity),
      rate: parseFloat(item.rate),
      amount: +(parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2),
    }));
    await InvoiceItem.bulkCreate(itemsToCreate, { transaction: t });

    await t.commit();

    logger.info(`Invoice created: ${invoice_number} for client: ${client_name}`);
    return created(res, { id: invoice.id, invoice_number: invoice.invoiceNumber }, 'Invoice created successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// PUT /api/invoices/:id
exports.updateInvoice = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const invoice = await Invoice.findByPk(req.params.id, { transaction: t });
    if (!invoice) { await t.rollback(); return notFound(res, 'Invoice not found'); }

    const {
      client_name, client_phone, client_address,
      event_type, invoice_number, invoice_date, event_date,
      discount_percent = 0, tax_percent = 0,
      notes, status, items,
    } = req.body;

    // Update client
    const client = await upsertClient(t, { client_name, client_phone, client_address });

    // Recalculate totals
    const totals = calcTotals(items, parseFloat(discount_percent), parseFloat(tax_percent));

    await invoice.update({
      invoiceNumber: invoice_number,
      clientId: client.id,
      eventType: event_type,
      invoiceDate: invoice_date,
      eventDate: event_date || null,
      discountPercent: discount_percent,
      taxPercent: tax_percent,
      ...totals,
      notes,
      status,
    }, { transaction: t });

    // Replace items
    await InvoiceItem.destroy({ where: { invoiceId: invoice.id }, transaction: t });
    const itemsToCreate = items.map(item => ({
      invoiceId: invoice.id,
      category: item.category,
      description: item.description || null,
      quantity: parseFloat(item.quantity),
      rate: parseFloat(item.rate),
      amount: +(parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2),
    }));
    await InvoiceItem.bulkCreate(itemsToCreate, { transaction: t });

    await t.commit();
    logger.info(`Invoice updated: ${invoice.invoiceNumber}`);
    return success(res, { id: invoice.id }, 'Invoice updated successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

// PATCH /api/invoices/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return notFound(res, 'Invoice not found');
    await invoice.update({ status: req.body.status });
    logger.info(`Invoice ${invoice.invoiceNumber} status → ${req.body.status}`);
    return success(res, { id: invoice.id, status: req.body.status }, 'Status updated');
  } catch (err) {
    next(err);
  }
};

// DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return notFound(res, 'Invoice not found');
    const num = invoice.invoiceNumber;
    await invoice.destroy();
    logger.info(`Invoice deleted: ${num}`);
    return success(res, null, `Invoice ${num} deleted`);
  } catch (err) {
    next(err);
  }
};
