// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   from: {
//     type: String,
//     required: true,
//   },
  
//   price: {
//     type: Number,
//     required: true,
//   },
//   photo: {
//     type: String,
//     default: '',
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('Booking', bookingSchema);

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
  },

  // ✅ Add this: link booking to the user who created it
  user: {
    type: mongoose.Schema.Types.ObjectId, // this is the user's ID
    ref: 'User',                          // reference the User model
    required: true,
  }

}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
