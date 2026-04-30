const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: { msg: 'Invoice number already exists' },
    validate: {
      notEmpty: { msg: 'Invoice number is required' },
    },
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'clients', key: 'id' },
  },
  eventType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isIn: {
        args: [['Wedding', 'Reception', 'Engagement', 'Birthday', 'Anniversary', 'Corporate', 'Other']],
        msg: 'Invalid event type',
      },
    },
  },
  invoiceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: { msg: 'Invalid invoice date' },
    },
  },
  eventDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  discountPercent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Discount cannot be negative' },
      max: { args: [100], msg: 'Discount cannot exceed 100%' },
    },
  },
  taxPercent: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Tax cannot be negative' },
    },
  },
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  discountAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  taxAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  grandTotal: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('unpaid', 'paid', 'cancelled', 'partial'),
    defaultValue: 'unpaid',
    validate: {
      isIn: {
        args: [['unpaid', 'paid', 'cancelled', 'partial']],
        msg: 'Status must be unpaid, paid, partial, or cancelled',
      },
    },
  },
}, {
  tableName: 'invoices',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['invoice_number'], unique: true },
    { fields: ['client_id'] },
    { fields: ['status'] },
    { fields: ['invoice_date'] },
  ],
});

module.exports = Invoice;
