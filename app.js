require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const ConnectDB = require('./db/index.js');
const bookingRoutes = require('./Controller/Booking.js');
const userRoutes = require('./Controller/user.js');

const app = express();
const { PORT = 3001 } = process.env;

// 👉 Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 👉 Serve static public files if any
const rootDir = __dirname;
app.use(express.static(path.join(rootDir, 'Public')));

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api', bookingRoutes);  // Booking-related routes (with multer used per route)
app.use('/api', userRoutes);     // User-related routes

// ✅ Connect to DB and Start Server
const startServer = async () => {
  try {
    await ConnectDB();
    console.log('✅ Connected to MongoDB');

    app.listen(PORT,'0.0.0.0', () => {
      console.log(`✅ Server is running at http://192.168.43.51:3001:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
  }
};

startServer();
