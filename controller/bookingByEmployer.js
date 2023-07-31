const BookingByEmployer = require('../models/bookingByEmployer');

// exports.createBookingByEmployer = async (req, res) => {
//   try {

//     const {
//       EmployerId,
//       manpowerId,
//       amount_per_hour,
//       payment,
//       workDetails,
//       workDurationInYear,
//       date,
//       workLocation,
//       startDate
//     } = req.body;

//     const user = await BookingByEmployer.findOne({
//       $and: [
//         { EmployerId: EmployerId },
//         { manpowerId: manpowerId }
//       ]
//     });
//     if (user) {
//       return res.status(404).json({ error: "Booking already exist" });
//     }
    
//     const newBooking = new BookingByEmployer({
//       EmployerId,
//       manpowerId,
//       amount_per_hour,
//       payment,
//       workDetails,
//       workDurationInYear,
//       date,
//       workLocation,
//       startDate
//     });
    
//     const savedBooking = await newBooking.save();

//     res.status(201).json({ message: 'Booking created successfully', data: savedBooking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// }



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



























// const bookings = require("../models/BookingByEmployer");
// const userSchema = require("../../models/User");
// const heroSchema = require("../../models/hero");
// const combinedSchema = require("../../models/combineservicesAndcategory");
// const serviceSchema = require("../../models/services");
// const moment = require("moment");
// const revenue = require("../../models/revenue");

// module.exports.bookService = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const data1 = await userSchema.findById({ _id: req.body.userId });
//     if (!data1 || data1.length == 0)
//       return res.status(400).send({ msg: "no user found" });
//     const data2 = await heroSchema.findById({ _id: req.body.heroId });
//     if (!data2 || data2.length == 0)
//       return res.status(400).send({ msg: "no hero found " });
//     data2.categoryStatus = "Accept";
//     await data2.save();
//     console.log(data2._id);



//         const { start_time, end_time } = req.body;
    
//         //const timeString = "18:47"; // example time string in "HH:mm" format
//         const currentDate = new Date(); // current date object
        
//         // Get the current date in yyyy-MM-dd format
//         const year = currentDate.getFullYear();
//         const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//         const day = String(currentDate.getDate()).padStart(2, "0");
//         const dateString = `${year}-${month}-${day}`;
        
//         // Combine the date and time string
//         const dateTimeString1 = `${dateString}T${start_time}`;
//         const dateTimeString2 = `${dateString}T${end_time}`;
        
//         console.log(dateTimeString1 , dateTimeString2); // Output: "2023-04-25T18:47:00.000Z"
        


//         // //const dateTimeString = "2023-04-25T18:47"; // example date-time string without seconds
//         // const dateTimeParts1 = start_time.split("T");
//         // const dateTimeParts2 = end_time.split("T"); // split the date-time string at "T" to get date and time separately
//         // const timeString1 = dateTimeParts1[1]; // extract the time part from the splitted array
//         // const timeString2 = dateTimeParts2[1];
        
//         // console.log(timeString1,timeString2); // Output: "18:47"
        


//     const bookingO = {
//       userId: data1._id,
//       userobject: data1,
//       heroId: data2._id,
//       heroobject: data2,
//       status: req.body.status,
//       amount: parseInt(req.body.amount),
//       payment: req.body.payment,
//       now_schedule: req.body.now_schedule,
//       rewards: req.body.rewards,
//       start_time: dateTimeString1,
//       end_time: dateTimeString2,
//       // timer: e + ":" + f,
//       location: req.body.location,
//       service: req.body.service,
//     };
//     // console.log(bookingO)
//     const bookingData = await bookings.create(bookingO);
//     console.log(bookingData);

//     const data = await revenue.create({
//       projectId: bookingData._id,
//       customer: bookingData.userobject.name,
//       hero: bookingData.heroobject.name,
//       service: bookingData.service,
//       date: bookingData.createdAt,
//       time: bookingData.createdAt,
//       totalAmount: bookingData.amount,
//       //  commission: req.body.commission,
//       //   earning: bookingsData.amount - parseInt(req.body.commission),
//     });
//     console.log(data);

//     return res.status(200).send(bookingData);
//   } catch (error) {
//     return res.status(400).json({ msg: error.message, name: error.name });
//   }
// };

module.exports.getbookingsbycustomer = async (req, res) => {
  try {
    const services = await bookings.find();
    console.log(services);
    if (!services || services.length == 0) {
      return res.status(400).json({ msg: "No services added" });
    } else {
      return res.status(200).json(services);
    }
  } catch (error) {
    return res.status(400).json({ msg: error.message, name: error.name });
  }
};

exports.getbookingbyidbycustomer = async (req, res) => {
  try {
    const booking = await bookings.find({ userId: req.params.id });
    if (!booking) {
      return res.status(400).json({
        message: "booking not found",
      });
    }
    return res.status(200).json({
      message: "booking found",
      data: booking,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

exports.getbookingbyidbyHeroId = async (req, res) => {
  try {
    const booking = await bookings.find({ heroId: req.params.id });
    if (!booking || booking.length == 0) {
      return res.status(400).json({
        message: "booking not found",
      });
    }
    return res.status(200).json({
      message: "booking found",
      data: booking,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

module.exports.getbookingsbyId = async (req, res) => {
  try {
    const services = await bookings.find({ _id: req.params.id });
    console.log(services);
    if (!services || services.length == 0) {
      return res.status(400).json({ msg: "No services added" });
    } else {
      return res.status(200).json(services);
    }
  } catch (error) {
    return res.status(400).json({ msg: error.message, name: error.name });
  }
};
// exports.getbookingbyidbyHeroId = async (req, res) => {
//   try {
//     for (let i = 0; i < bookings.length; i++) {
//       const booking = await bookings.findOne({ userId: req.params.id });
//       if (!booking) {
//         return res.status(400).json({
//           message: "booking not found",
//         });
//       }
//       console.log(booking);
//       let a = [];
//       for (let i = 0; i < booking.heroobject.length; i++) {
//         a.push(booking.heroobject[i]);
//       }
//       //console.log(a)

//       let b = [];
//       for (let i = 0; i < a.length; i++) {
//         b.push(a[i]._id);
//       }
//       ///console.log(b)

//       let e = req.params.e;
//       var value;
//       for (let i = 0; i < b.length; i++) {
//         console.log(b[i]);
//         if (b[i].toString() === e.toString()) {
//           console.log("Clixo");
//           value = b[i].toString();
//           break;
//         }
//       }
//       console.log(value);
//     }
//   } catch (err) {
//     console.log(err.message);
//     return res.status(500).json({
//       message: "internal server error",
//     });
//   }
// };

// exports.timer = async (req, res) => {
//   try{
//   // const duration = req.body.duration ||1; // Default duration is 30 minutes
//   // const unit = req.body.unit || 'minutes'; // Default unit is minutes

//   // Calculate the expiration time
//   // const expirationTime = new Date();
//   // expirationTime.setTime(expirationTime.getTime() + (duration * 60 * 1000));

// // console.log(expirationTime)

//     // Start the timer
//     // let timer;
//     // let responseSent = false;
//     // timer = setTimeout(() => {
//       // Generate OTP here
//       const otp = Math.floor(Math.random() * 900000) + 100000; // Generate a 6-digit OTP

//       if (!responseSent) {
//         responseSent = true;
//         // Return the OTP
//        return res.status(200).json({
//           status: 'success',
//           message: 'Timer expired successfully.',
//           otp: otp
//         });

//       }
//        clearTimeout(timer);
//     }, duration * 60 * 1000);

// // // Return the expiration time
// // return res.status(200).json({
// //   status: 'success',
// //   message: 'Timer started successfully.',
// //   expires_at: expirationTime.toISOString()
// // });
// } catch (err) {
//       console.log(err.message);
//       return res.status(500).json({
//         message: "internal server error",
//       });
//     }
//   };
