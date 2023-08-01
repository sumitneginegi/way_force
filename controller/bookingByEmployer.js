const BookingByEmployer = require('../models/bookingByEmployer');

exports.createBookingByEmployer = async (req, res) => {
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
    } = req.body;

    // const existingBooking = await BookingByEmployer.findOne({ EmployerId, manpowerId });
    const existingBooking = await BookingByEmployer.findOne({
            $and: [
              { EmployerId: EmployerId },
              { manpowerId: manpowerId }
            ]
          });

    if (existingBooking) {
      // Check if work duration in years has been completed from the start date
      const today = new Date();
      const startDateObj = new Date(startDate);
      const diffInYears = Math.floor((today - startDateObj) / (365 * 24 * 60 * 60 * 1000));

      if (diffInYears >= workDurationInYear) {
        // If work duration in years has been completed, delete the existing data
        // await BookingByEmployer.deleteOne({ EmployerId, manpowerId });
        await BookingByEmployer.deleteOne({
          $and: [
            { EmployerId: EmployerId },
            { manpowerId: manpowerId }
          ]
        });

        // Create a new booking with the updated details
        const newBooking = new BookingByEmployer({
          EmployerId,
          manpowerId,
          amount_per_hour,
          payment,
          workDetails,
          workDurationInYear,
          date,
          workLocation,
          startDate,
        });

        const savedBooking = await newBooking.save();
        return res.status(201).json({ message: 'Booking updated successfully', data: savedBooking });
      } else {
        return res.status(409).json({ error: 'Work duration not completed yet' });
      }
    }

    const newBooking = new BookingByEmployer({
      EmployerId,
      manpowerId,
      amount_per_hour,
      payment,
      workDetails,
      workDurationInYear,
      date,
      workLocation,
      startDate,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', data: savedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


exports.getBookingByEmployer = async (req, res) => {
  try {
    const employerId = req.params.employerId;

    // Find bookings by EmployerId
    const bookings = await BookingByEmployer.find({ EmployerId: employerId });

    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

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



