const { Sequelize } = require('sequelize');
const config = require('../config/database');
const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions || {},
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info(`✅ PostgreSQL connected [${dbConfig.host}:${dbConfig.port}/${dbConfig.database}]`);
    // NOTE: No sequelize.sync() here — schema is managed by migrations
    // Run: npm run db:migrate  to create/update tables
  } catch (err) {
    logger.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
