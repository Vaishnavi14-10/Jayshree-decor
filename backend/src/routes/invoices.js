const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/invoiceController');
const validate = require('../middlewares/validate');
const { createInvoiceRules, updateStatusRules, idParamRule } = require('../validations/invoiceValidations');

// Meta routes (must be before /:id)
router.get('/meta/next-number', ctrl.getNextNumber);
router.get('/meta/stats',       ctrl.getStats);

// CRUD
router.get('/',    ctrl.getAllInvoices);
router.post('/',   createInvoiceRules, validate, ctrl.createInvoice);

router.get('/:id',      idParamRule, validate, ctrl.getInvoice);
router.put('/:id',      idParamRule, createInvoiceRules, validate, ctrl.updateInvoice);
router.patch('/:id/status', updateStatusRules, validate, ctrl.updateStatus);
router.delete('/:id',   idParamRule, validate, ctrl.deleteInvoice);

module.exports = router;
