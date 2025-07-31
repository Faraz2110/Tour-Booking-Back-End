const mongoose = require('mongoose');
const { DB_NAME } = require('../utils/constants.js');

const ConnectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`, {
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
   
  }
};

module.exports = ConnectDB;

