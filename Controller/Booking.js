const express = require('express');
const router = express.Router();
const path = require('path');
const Booking = require('../model/Booking.js');

router.post('/bookings', async (req, res) => {
  try {
    const { name, from, price } = req.body; 
    console.log(req.file);
    console.log( name, from, price);
    const photo=req.file.path
    const newBooking = new Booking({
      name,
      from,
      price,
      photo
    });
    await newBooking.save();
    res.status(201).json({
      message: 'Booking added successfully',
      booking: newBooking
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


// PUT request to update a booking
router.put('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;  // The booking ID from the URL
    const { name, from, to, price } = req.body;  // The updated data from the request body

    // Find the booking by ID and update it
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,  // The booking ID
      { name, from, to, price },  // The fields to update
      { new: true }  // Option to return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE request to delete a booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;

