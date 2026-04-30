const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Client name cannot be empty' },
      len: { args: [2, 255], msg: 'Name must be between 2 and 255 characters' },
    },
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      is: { args: /^[+\d\s\-().]{7,20}$/, msg: 'Invalid phone number format' },
    },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'clients',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['phone'] },
    { fields: ['name'] },
  ],
});

module.exports = Client;
