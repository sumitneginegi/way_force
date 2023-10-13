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
    } = req.body

    // const existingBooking = await BookingByEmployer.findOne({ EmployerId, manpowerId });
    const existingBooking = await BookingByEmployer.findOne({
            $and: [
              { EmployerId: EmployerId },
              { manpowerId: manpowerId }
            ]
          })

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
        })

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

        const savedBooking = await newBooking.save()
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
    })

    const savedBooking = await newBooking.save()

   return res.status(201).json({ message: 'Booking created successfully', data: savedBooking });
  } catch (error) {
    console.error(error);
   return res.status(500).json({ error: 'Something went wrong' });
  }
}


exports.calculateTimeDifference = (startTime, endTime) => {
  // const start = new Date(startTime);
  // const end = new Date(endTime);
  console.log(start);
  const timeDifferenceInMs = endTime - startTime;
  const hours = Math.floor(timeDifferenceInMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifferenceInMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}



exports.calculateTimeDifferenceController = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: "Both startTime and endTime are required" });
    }

    const timeDifference = exports.calculateTimeDifference(startTime, endTime);

    return res.status(200).json({ timeDifference });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}



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


