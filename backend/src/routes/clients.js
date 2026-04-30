const express = require('express');
const router = express.Router();
const { Client, Invoice } = require('../models');
const { success, notFound } = require('../utils/response');
const { Op } = require('sequelize');

// GET /api/clients - search clients
router.get('/', async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = search
      ? { [Op.or]: [{ name: { [Op.iLike]: `%${search}%` } }, { phone: { [Op.iLike]: `%${search}%` } }] }
      : {};
    const clients = await Client.findAll({ where, order: [['name', 'ASC']], limit: 50 });
    return success(res, clients);
  } catch (err) { next(err); }
});

// GET /api/clients/:id/invoices
router.get('/:id/invoices', async (req, res, next) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{ model: Invoice, as: 'invoices', order: [['createdAt', 'DESC']] }],
    });
    if (!client) return notFound(res, 'Client not found');
    return success(res, client);
  } catch (err) { next(err); }
});

module.exports = router;
