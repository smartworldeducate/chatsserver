const mongoose = require('mongoose');
require('dotenv').config();

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/chatbes_server';
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

connectToDatabase()
  .then(() => console.log('DB connected successfully...'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function connectToDatabase() {
  await mongoose.connect(MONGODB_URI);
}

module.exports = mongoose;
