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
  imageUrl: {
    type: String,
    default: '', // optional field with default fallback
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
