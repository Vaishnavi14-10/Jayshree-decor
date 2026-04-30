const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'invoices', key: 'id' },
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Category is required' },
      isIn: {
        args: [['Props', 'Menu Board', 'Display', 'Dessert', 'Lighting', 'Floral', 'Stage Setup', 'Sound & DJ', 'Photography', 'Other']],
        msg: 'Invalid category',
      },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [0.01], msg: 'Quantity must be greater than 0' },
    },
  },
  rate: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Rate cannot be negative' },
    },
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'invoice_items',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['invoice_id'] },
    { fields: ['category'] },
  ],
});

module.exports = InvoiceItem;
