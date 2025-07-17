const express = require('express');
const router = express.Router();
const path = require('path');
const Booking = require('../model/Booking.js');
const authenticate = require('../utils/authenticate.js'); // add this at the top

router.post('/bookings', authenticate, async (req, res) => {
  console.log('🔥 req.user:', req.user);
  try {
    const { name, from, price,company } = req.body;
    const photo = req.file ? req.file.path : null;

    const newBooking = new Booking({
      name,
      from,
      price,
      company,
      photo,
      user: req.user._id, // attach logged-in user ID
    });

    await newBooking.save();

    res.status(201).json({
      message: 'Booking added successfully',
      booking: newBooking,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    console.log('Fetched bookings:', bookings); // 👈 Logs to your backend terminal
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error in GET /bookings:', error.message); // 👈 Logs errors clearly
    res.status(500).json({ error: error.message });
  }
});


// route to get a single booking by ID
router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// PUT: Update Booking (only if user is owner)
router.put('/bookings/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, from, price,company } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Not your booking' });
    }

    // Update booking fields
    booking.name = name;
    booking.from = from;
    booking.price = price;
    booking.company = company;

    await booking.save();

    res.status(200).json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Delete Booking (only if user is owner)
router.delete('/bookings/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if the booking belongs to the logged-in user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Not your booking' });
    }

    await booking.deleteOne();

    res.status(200).json({ message: 'Booking deleted successfully', booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;

