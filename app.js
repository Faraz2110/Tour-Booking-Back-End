// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Import custom modules
const ConnectDB = require('./db/index.js');
const bookingRoutes = require('./Controller/Booking.js');
const userRoutes = require('./Controller/user.js');

// Create Express app
const app = express();

// Environment variables
const { MONGO_URI,JWT_SECRET, PORT = 3001 } = process.env;

// Serve static files from uploads directory
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
// app.use(multer(multerOptions).single('photo'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Serve frontend static files (optional, if you have a public folder)
const rootDir = __dirname;
app.use(express.static(path.join(rootDir, 'Public')));

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(multer(multerOptions).single('photo')); // Handle single file upload under field name 'photo'

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
