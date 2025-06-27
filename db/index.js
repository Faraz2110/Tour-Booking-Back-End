const mongoose = require('mongoose');
const DB_NAME = require('../utils/constants.js');

const ConnectDB=async()=>{
try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log('DB Connected');
    
} catch (error) {
    console.log('MongoDB Connection Erro : ', error);
    
}
}

module.exports = ConnectDB;