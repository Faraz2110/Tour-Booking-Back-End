
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


const ConnectDB = require('./db/index.js');
const bookingRoutes = require('./Controller/Booking.js');
const userRoutes = require('./Controller/user.js');


const app = express();


const { MONGO_URI,JWT_SECRET, PORT = 3001 } = process.env;

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions = {
  storage,fileFilter
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const rootDir = __dirname;
app.use(express.static(path.join(rootDir, 'Public')));

// Middleware setup
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(multer(multerOptions).single('photo')); 

// API routes
app.use('/api', bookingRoutes); // Booking-related routes
app.use('/api', userRoutes); // User-related routes

// Start server after connecting to DB
const startServer = async () => {
  try {
    await ConnectDB(); // Connect to MongoDB
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit with failure
  }
};

startServer(); // Initialize server
