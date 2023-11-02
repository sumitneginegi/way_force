const BookingByEmployer = require('../models/bookingByEmployer');
const User = require("../models/user")


exports.getBookingByEmployer = async (req, res) => {
  try {
    // Find bookings by EmployerId
    const bookings = await BookingByEmployer.find({ employerId: req.params.employerId });

    if (!bookings || bookings.length == 0) {
      return res.status(404).json({ error: 'No bookings found for this employer.' });
    }

    return res.status(200).json({ data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.getBookingByManpower = async (req, res) => {
  try {
    const manpowerId = req.params.manpowerId;

    // Find bookings by manpowerId
    const bookings = await BookingByEmployer.find({ manpowerId: manpowerId });

    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


exports.updateBookingByEmployer = async (req, res) => {
  try {
    const {
      EmployerId,
      manpowerId,
      amount_per_hour,
      payment,
      workDetails,
      workDurationInYear,
      date,
      workLocation,
      startDate,
    } = req.body

    const existingBooking = await BookingByEmployer.findOne({
      $and: [
        { EmployerId: EmployerId },
        { manpowerId: manpowerId }
      ]
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if work duration in years has been completed from the start date
    const today = new Date();
    const startDateObj = new Date(startDate);
    const diffInYears = Math.floor((today - startDateObj) / (365 * 24 * 60 * 60 * 1000));

    if (diffInYears >= workDurationInYear) {
      // If work duration in years has been completed, update the booking with the provided data
      existingBooking.amount_per_hour = amount_per_hour;
      existingBooking.payment = payment;
      existingBooking.workDetails = workDetails;
      existingBooking.workDurationInYear = workDurationInYear;
      existingBooking.date = date;
      existingBooking.workLocation = workLocation;
      existingBooking.startDate = startDate;

      const savedBooking = await existingBooking.save();
      return res.status(200).json({ message: 'Booking updated successfully', data: savedBooking });
    } else {
      return res.status(409).json({ error: 'Work duration not completed yet' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}



exports.deleteBooking = async (req, res) => {
  try {
    const { Bookingg } = req.params

    const deletedBookingg = await BookingByEmployer.findByIdAndRemove(Bookingg);

    if (!deletedBookingg) {
      return res.status(404).json({ error: 'Bookingg not found.' });
    }

    res.json({ message: 'Booking deleted successfully.' })
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'An error occurred while deleting the Payment.' });
  }
}




exports.createBookingByEmployer = async (req, res) => {
  try {
    const {
      employerId,
      userId,
      payment,
      workDetails,
      workDurationInYear,
      date,
      workLocation,
      startDate,

    } = req.body;

    console.log(req.body);

    if (employerId === userId) {
      return res.status(400).json({ error: "Employers cannot book themselves." });
    }

    // Create a new booking
    const newBooking = new BookingByEmployer({
      employerId,
      userId,
      payment,
      workDetails,
      workDurationInYear,
      date,
      workLocation,
      startDate,
      instantOrdirect: "Direct"  //{ $regex: new RegExp(category, 'i') }
      // lati: req.body.lati, // Use lati from work location
      // longi: req.body.longi, // Use longi from work location
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      data: savedBooking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}




exports.getEmployersWhoBookedManpower = async (req, res) => {
  try {
    const manpowerUserId = req.params.manpowerUserId;

    // Find all bookings for the specified manpower user without 'acceptOrDecline'
    const bookings = await BookingByEmployer.find({
      userId: manpowerUserId,
      acceptOrDecline: { $exists: false }, // Exclude bookings with 'acceptOrDecline' field
    }).populate('employerId', 'employerName'); // Populate the 'employerId' field from the User model and select the 'name' field


    return res.status(200).json({msg:bookings.length,
      bookings: bookings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


exports.updateBookingAcceptOrDecline = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    const newStatus = req.body.status; // 'accept' or 'reject'

    if (/^accept$/i.test(newStatus)) {
      // Update the 'acceptOrDecline' field to 'accept'
      await BookingByEmployer.findByIdAndUpdate(bookingId, {
        $set: { acceptOrDecline: 'accept' },
      });

      return res.status(200).json({ message: 'Booking accepted' });
    } else if (/^reject$/i.test(newStatus)) {
      // Delete the booking with 'reject' status
      await BookingByEmployer.findByIdAndDelete(bookingId);

      return res.status(200).json({ message: 'Booking rejected and deleted' });
    } else {
      return res.status(400).json({ error: 'Invalid status value' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};



exports.scheduleBooking = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

     // Extract the date part of currentDate
     const currentDateString = currentDate.toISOString().split('T')[0];

     // Find bookings that meet all three conditions
     const bookings = await BookingByEmployer.find({
      $and: [
        { userId: req.params.id },
        { startDate: { $gte: currentDateString } },
        { acceptOrDecline: "accept" },
      ],
    });

    return res.status(200).json({
      bookings: bookings,
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

