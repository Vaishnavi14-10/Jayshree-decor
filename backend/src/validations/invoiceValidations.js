const { body, param, query } = require('express-validator');

const VALID_EVENT_TYPES = ['Wedding', 'Reception', 'Engagement', 'Birthday', 'Anniversary', 'Corporate', 'Other'];
const VALID_STATUSES = ['unpaid', 'paid', 'cancelled', 'partial'];
const VALID_CATEGORIES = ['Props', 'Menu Board', 'Display', 'Dessert', 'Lighting', 'Floral', 'Stage Setup', 'Sound & DJ', 'Photography', 'Other'];

const createInvoiceRules = [
  // Client
  body('client_name').trim().notEmpty().withMessage('Party/client name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be 2–255 characters'),
  body('client_phone').optional({ nullable: true, checkFalsy: true })
    .matches(/^[+\d\s\-().]{7,20}$/).withMessage('Invalid phone number'),
  body('client_address').optional({ nullable: true, checkFalsy: true })
    .isLength({ max: 500 }).withMessage('Address too long'),

  // Invoice meta
  body('invoice_number').trim().notEmpty().withMessage('Invoice number is required'),
  body('invoice_date').notEmpty().withMessage('Invoice date is required')
    .isDate().withMessage('Invalid invoice date'),
  body('event_date').optional({ nullable: true, checkFalsy: true })
    .isDate().withMessage('Invalid event date'),
  body('event_type').optional().isIn(VALID_EVENT_TYPES)
    .withMessage(`Event type must be one of: ${VALID_EVENT_TYPES.join(', ')}`),

  // Financials
  body('discount_percent').optional().isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be 0–100'),
  body('tax_percent').optional().isFloat({ min: 0 })
    .withMessage('Tax must be 0 or more'),
  body('status').optional().isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),

  // Items array
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.category').isIn(VALID_CATEGORIES)
    .withMessage(`Each item category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('items.*.quantity').isFloat({ min: 0.01 })
    .withMessage('Each item quantity must be > 0'),
  body('items.*.rate').isFloat({ min: 0 })
    .withMessage('Each item rate must be >= 0'),
];

const updateStatusRules = [
  param('id').isInt({ min: 1 }).withMessage('Invalid invoice ID'),
  body('status').notEmpty().isIn(VALID_STATUSES)
    .withMessage(`Status must be one of: ${VALID_STATUSES.join(', ')}`),
];

const idParamRule = [
  param('id').isInt({ min: 1 }).withMessage('Invalid ID'),
];

module.exports = { createInvoiceRules, updateStatusRules, idParamRule };
