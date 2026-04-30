const Client = require('./Client');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');

// Client <-> Invoice
Client.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices', onDelete: 'CASCADE' });
Invoice.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Invoice <-> InvoiceItem
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

module.exports = { Client, Invoice, InvoiceItem };
