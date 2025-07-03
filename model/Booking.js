const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  
  price: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
