const { Sequelize } = require('sequelize');
require('dotenv').config();

const DEFAULT_URL = 'postgres://postgres:postgres@localhost:5432/chatbes_server';
const DATABASE_URL = process.env.DATABASE_URL || DEFAULT_URL;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('DB connected successfully...');
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
}

connectToDatabase();

module.exports = { sequelize };
