var admin = require("firebase-admin");
var serviceAccount = require("../firebasee.json");
// Check if the app has already been initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Other Firebase configuration options
  });
}
const BookingByEmployer = require('../models/bookingByEmployer');
const User = require("../models/user")
const Category = require("../models/categoryModel")
const mongoose = require('mongoose');


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
      workDay,
      date,
      workLocation,
      startDate,
    } = req.body

    console.log(req.body);
    if (employerId === userId) {
      return res.status(400).json({ error: "Employers cannot book themselves." });
    }

    // Check if a booking with the same employer, user, and startDate already exists
    const existingBooking = await BookingByEmployer.findOne({
      employerId,
      userId,
      startDate,
    });

    if (existingBooking) {
      return res.status(400).json({ error: "A booking for the same employer and user with the same startDate already exists." });
    }


    // Create a new booking
    const newBooking = new BookingByEmployer({
      employerId,
      userId,
      payment,
      workDetails,
      workDurationInYear,
      workDay,
      date,
      workLocation,
      startDate,
      instantOrdirect: "Direct"  //{ $regex: new RegExp(category, 'i') }
      // lati: req.body.lati, // Use lati from work location
      // longi: req.body.longi, // Use longi from work location
    });

    var savedBooking = await newBooking.save();

     // Populate the userId to get the category field
     await savedBooking.populate({
      path: 'userId',
      model: 'User', // Replace with the actual User model name
      select: 'category', // Include only the name and price fields
    });


 // Now check the format of the category field inside userId
 const userI = savedBooking.userId
console.log(userI);
 let categoryId = userI.category; // Assuming category is a string that can be either name or ID

 // Check if categoryId is a valid ObjectId (ID format)
 if (mongoose.Types.ObjectId.isValid(categoryId)) {
   // It's already in ID format, so populate it directly
   categoryId = categoryId
 } else {
   // It's in name format, so let's look up the ID from the Category model
   const category = await Category.findOne({ name: categoryId });

   if (!category) {
     return res.status(404).json({ message: 'Category not found' });
   }

   categoryId = category._id;
 }

 // Populate the category field inside userId with the category name
 userI.category = categoryId;

 // Now, populate the category field inside userId
 await savedBooking.populate({
   path: 'userId.category',
   model: 'Category', // Replace with your actual Category model name
   select: 'name price', // Include only the name and price fields
 });



 // Extract the price from the populated user category
 const price = userI.category.price;
// console.log(typeof price);
 // Update the amount in the booking to the extracted price
 savedBooking.amount = parseFloat(price) * parseFloat(workDay)

 await savedBooking.save(); // Save the changes to the amount field

//  // Update the amount in the booking to the category's price
//  savedBooking.amount = categoryId.price;

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


    return res.status(200).json({
      msg: bookings.length,
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
        { Status: "pending" },
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


exports.sendNotificationForTodayDate = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Extract the date part of currentDate
    const currentDateString = currentDate.toISOString().split('T')[0];

    // Find bookings that meet all three conditions
    const bookings = await BookingByEmployer.find({
      $and: [
        { startDate: { $gte: currentDateString } },
        { acceptOrDecline: "accept" },
      ],
    });

    // Filter the bookings that have startDate equal to today's date
    const todayBookings = bookings.filter(booking => booking.startDate === currentDateString);

    // Create an array to collect the results of sending notifications
    const notificationPromises = [];

    // Loop through the filtered bookings
    for (const booking of todayBookings) {
      const employerId = booking.employerId;
      const userId = booking.userId;
      const bookingid = booking._id;

      // Find the employer and manpower users by their IDs
      const employerUserPromise = User.findById(employerId);
      const manpowerUserPromise = User.findById(userId);
      const bookingDetailsPromise = BookingByEmployer.findById(bookingid);

      // Create data objects for employer and manpower data
      const employerData = {};
      const manpowerData = {};

      // Use Promise.all to wait for all promises to resolve
      const [employerUser, manpowerUser, bookingDetails] = await Promise.all([
        employerUserPromise,
        manpowerUserPromise,
        // bookingDetailsPromise,
      ]);


      if (employerUser) {
        // Extract and include employer-specific data in the employerData object
        employerData.employerName = employerUser.employerName;
        // employerData.GST_Number = employerUser.GST_Number;
        // employerData.mobile = employerUser.mobile;
        // employerData._id = employerUser._id;
        // employerData.workingDays = employerUser.workingDays;
        // employerData.userType = employerUser.userType;
        // employerData.siteLocation = employerUser.siteLocation;
        // employerData.workingHours = employerUser.workingHours;
        // employerData.explainYourWork = employerUser.explainYourWork;
        // employerData.current_lati = employerUser.current_lati;
        // employerData.current_longi = employerUser.current_longi;
        // employerData.current_location = employerUser.current_location;
        // employerData.employerName = employerUser.employerName;
        // employerData.aadharCard = employerUser.aadharCard;
        // employerData.city = employerUser.city;
        // employerData.email = employerUser.email;
        // employerData.gender = employerUser.gender;
        // employerData.registration_Number = employerUser.registration_Number;
        // employerData.state = employerUser.state;
        // employerData.main_Address = employerUser.main_Address;

        //   if (bookingdetails) {
        //     // Include booking-specific data in the employerData object
        //     employerData.bookingData = {
        //       _id: bookingdetails._id,
        //       employerId: bookingdetails.employerId,
        //       userId: bookingdetails.userId,
        //       workDetails: bookingdetails.workDetails,
        //       workDurationInYear: bookingdetails.workDurationInYear,
        //       startDate: bookingdetails.startDate,
        //       instantOrdirect: bookingdetails.instantOrdirect,
        //       acceptOrDecline: bookingdetails.acceptOrDecline,
        //     };
        //   }
      }

      if (manpowerUser) {
        // Extract and include manpower-specific data in the manpowerData object
        manpowerData.manpowerName = manpowerUser.manpowerName;
        // manpowerData.aadharCard = manpowerUser.aadharCard;
        // manpowerData.mobile = manpowerUser.mobile;
        // manpowerData.email = manpowerUser.email;
        // manpowerData.city = manpowerUser.city;
        // manpowerData.siteLocation = manpowerUser.siteLocation;
        // manpowerData.workingDays = manpowerUser.workingDays;
        // manpowerData.workingHours = manpowerUser.workingHours;
        // manpowerData.explainYourWork = manpowerUser.explainYourWork;
        // manpowerData.state = manpowerUser.state;
        // manpowerData.pinCode = manpowerUser.pinCode;
        // manpowerData.gender = manpowerUser.gender;
        // manpowerData.userType = manpowerUser.userType;
        // manpowerData.main_Address = manpowerUser.main_Address;
        // manpowerData.category = manpowerUser.category;
        // manpowerData._id = manpowerUser._id;
      }

      //     if (employerUser && manpowerUser) {
      //       // Send notifications to employer and manpower
      //       const employerResult = await sendNotification(employerUser.token, manpowerData, 'Employer Notification Title', 'Employer Notification Body');
      //       const manpowerResult = await sendNotification(manpowerUser.token, employerData, 'Manpower Notification Title', 'Manpower Notification Body');
      //       notificationResults.push(employerResult, manpowerResult);
      //     }
      //   }
      // }

      //   return res.status(200).json({
      //     message: 'Notifications sent and user tokens updated successfully',
      //     notificationResults: notificationResults, // Include the results if needed
      //   });


      if (employerUser && manpowerUser) {
        // Send notification to employer and push the promise into the array
        notificationPromises.push(
          sendNotification(employerUser.token, manpowerData, 'Employer Notification Title', 'Employer Notification Body')
        );
        // Send notification to manpower and push the promise into the array
        notificationPromises.push(
          sendNotification(manpowerUser.token, employerData, 'Manpower Notification Title', 'Manpower Notification Body')
        );
      }

      // if (manpowerUser) {
      //   // Send notification to manpower and push the promise into the array
      //   notificationPromises.push(
      //     sendNotification(manpowerUser.token, employerData, 'Manpower Notification Title', 'Manpower Notification Body')
      //   );
      // }
      // Use Promise.all to send notifications to all users concurrently
      const notificationResults = await Promise.all(notificationPromises);
      // }



      return res.status(200).json({
        message: 'Notifications sent and user tokens updated successfully',
        notificationResults: notificationResults, // Include the results if needed
      });

    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};



// Function to send FCM notifications
async function sendNotification(token, data, title, body) {
  const message = {
    data: {
      // Include the data object as 'customData'
      customData: JSON.stringify(data),
    },
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return 'Notification sent successfully';
  } catch (error) {
    console.error('Error sending message:', error);
    return 'Failed to send notification';
  }
}


// exports.sendNotificationOfBookingToParticularEmployer = async (req, res) => {
//   try {
//     const { senderId, receiverId, body, title } = req.body;

//     // Find the sender and receiver users by their IDs
//     const bookingDetailsPromise = BookingByEmployer.findById(bookingid);
//     const senderUser = await User.findById(senderId).populate('additionalField1 additionalField2');
//     const receiverUser = await User.findById(receiverId).populate('additionalField1 additionalField2');


//     if (!senderUser || !receiverUser) {
//       return res.status(400).json({ message: "Invalid sender or receiver ID" });
//     }

//     // Create a notification message with the desired content based on the sender's role
//     let notificationMessage;

//     notificationMessage = {
//       data: {
//         senderId: senderUser._id ? senderUser._id.toString() : "",
//         receiverId: receiverUser._id ? receiverUser._id.toString() : "",
//         payload: `senderUser:${senderUser._id},receiverId: ${receiverUser._id},Mobile: ${senderUser.mobile},category:${category},siteLocation:${siteLocation}`,
//         // manpowerDetails: `Manpower-specific details here`,

//       },
//       notification: {
//         title: title,
//         body: body,
//       },
//       token: receiverUser.token,
//     };


// try {
//   const response = await admin.messaging().send(notificationMessage);
//   console.log('Successfully sent message:', response);
// } catch (error) {
//   console.error('Error sending message:', error);
//   return res.status(500).json({ message: "Failed to send notification" });
// }

// return res.status(200).json({ message: "Notification sent successfully" });
//   } catch (error) {
//   console.error(error);
//   return res.status(500).json({ message: "Internal Server Error" });
// }
// }


exports.getbookings = async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    const booking = await BookingByEmployer.findById(bookingId)
      .populate({
        path: 'userId',
        // populate: {
        //   path: 'category',
        //   model: 'Category', // Replace with your actual Category model name
        // },
        select: '', // Exclude the fields you want from the user data
      })
      .populate({
        path: 'employerId',
        select: '-obj', // Exclude the fields you want from the employer data
      });


    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Now check the format of the category field inside userId
    const userId = booking.userId;

    let categoryId = userId.category; // Assuming category is a string that can be either name or ID

    // Check if categoryId is a valid ObjectId (ID format)
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
      // It's already in ID format, so populate it directly
      categoryId = categoryId
    } else {
      // It's in name format, so let's look up the ID from the Category model
      const category = await Category.findOne({ name: categoryId });

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      categoryId = category._id;
    }

    // Populate the category field inside userId with the category name
    userId.category = categoryId;

    // Now, populate the category field with the category name
    await booking.populate({
      path: 'userId.category', // Assuming category is a reference field inside userId
      model: 'Category', // Replace with your actual Category model name
      select: 'name price', // Include only the name field
    })

    return res.status(200).json(booking);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}


// Define a route to generate and save a random OTP for a booking

exports.generate_otp = async (req, res) => {
  const manpowerId = req.params.manpowerId;

  // Generate a random OTP (6-digit numeric OTP)
  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    const booking = await BookingByEmployer.updateMany(
      { userId: manpowerId },
      { $set: { otp: otp } },
      { new: true }
    );
    console.log(booking);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({ message: 'OTP generated and saved successfully', booking: booking });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}



// Define a function to verify OTP for a specific employer
exports.verifyOTP = async (req, res) => {
  const employerId = req.params.employerId;
  const providedOTP = req.body.otp; // Assuming the OTP is sent in the request body

  try {

    // First, find all bookings for the specific employer
    const bookings = await BookingByEmployer.find({ employerId: employerId });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'Employer not found or no bookings exist for this employer' });
    }

    // Check if the provided OTP matches any booking's OTP
    const validBooking = bookings.find(booking => booking.otp === providedOTP);

    if (!validBooking) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    console.log(validBooking);

    // If the OTP is valid and matches a booking's OTP, update its status to 'ongoing'
    // You can also clear the OTP in the database or mark the booking as verified
    const updatedBooking = await BookingByEmployer.findByIdAndUpdate(
      validBooking._id,
      { Status: 'ongoing', verified: true },
      { new: true } // This option returns the updated document
    );

    if (!updatedBooking) {
      return res.status(500).json({ message: 'Failed to update booking status' });
    }

    console.log(updatedBooking);

    return res.status(200).json({ message: 'OTP verified successfully', booking: updatedBooking });
  }
  catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}


exports.getOngoingBookings = async (req, res) => {
  try {

    const id = req.query.id.toString(); // Convert id to a string
    const Status = req.query.Status;
    // Find a booking that matches both id and Status using $and
    const ongoingBooking = await BookingByEmployer.find({
      $and: [
        { userId: id },
        { Status: Status }
      ]
    }).populate({
      path: 'userId',
      select: '', // Exclude the fields you want from the user data
    })
      .populate({
        path: 'employerId',
        select: '-obj', // Exclude the fields you want from the employer data
      });
    // .populate('userId employerId'); // Replace 'userId' and 'employerId' with the actual field names in your schema.
    if (!ongoingBooking) {
      return res.status(500).json({ message: 'no booking' });
    }
    return res.status(200).json({ bookings: ongoingBooking });

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ message: 'Something went wrong' });
  }
}



exports.updateStatusToCompleted = async (req, res) => {
  const itemId = req.params.id;

  try {
    // Find the document by its _id and update only the 'status' field to 'completed'
    const updatedItem = await BookingByEmployer.findOneAndUpdate(
      { _id: itemId },
      { $set: { Status: 'completed' } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.status(200).json({ message: 'Status updated to completed', updatedItem });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}



exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Use the Mongoose model to find a booking by its ID
    const booking = await BookingByEmployer.findById(bookingId)
    .populate({
      path: 'userId',
      select: '', // Exclude the fields you want from the user data
    })
      .populate({
        path: 'employerId',
        select: '-obj', // Exclude the fields you want from the employer data
      });

    if (!booking) {
      // If no booking with the given ID is found, return a 404 response
      return res.status(404).json({ error: 'Booking not found' });
    }


 // Populate the userId to get the category field
 await booking.populate({
  path: 'userId',
  model: 'User', // Replace with the actual User model name
  // select: 'category', // Include only the name and price fields
});


// Now check the format of the category field inside userId
const userI = booking.userId
console.log(userI);
let categoryId = userI.category; // Assuming category is a string that can be either name or ID

// Check if categoryId is a valid ObjectId (ID format)
if (mongoose.Types.ObjectId.isValid(categoryId)) {
// It's already in ID format, so populate it directly
categoryId = categoryId
} else {
// It's in name format, so let's look up the ID from the Category model
const category = await Category.findOne({ name: categoryId });

if (!category) {
 return res.status(404).json({ message: 'Category not found' });
}

categoryId = category._id;
}

// Populate the category field inside userId with the category name
userI.category = categoryId;

// Now, populate the category field inside userId
await booking.populate({
path: 'userId.category',
model: 'Category', // Replace with your actual Category model name
select: 'name price', // Include only the name and price fields
});



    // Return the booking if found
 return   res.status(200).json({data:booking});
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};




// Define an update function to set payment status to true
exports.updatePaymentStatus = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    // Use the Mongoose model to find the booking by its ID
    const booking = await BookingByEmployer.findById(bookingId);

    if (!booking) {
      // If no booking with the given ID is found, return a 404 response
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Update the payment status to true
    booking.paymentStatus = "true";

    // Save the updated booking
    await booking.save();

    // Return a success response
    res.status(200).json({ message: 'Payment status updated successfully',data:booking });
  } catch (error) {
    // Handle any errors that may occur during the update
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};



exports.scheduleBookingOfEmployer = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Extract the date part of currentDate
    const currentDateString = currentDate.toISOString().split('T')[0];

    // Find bookings that meet all three conditions
    const bookings = await BookingByEmployer.find({
      $and: [
        { employerId: req.params.id },
        { startDate: { $gte: currentDateString } },
        { acceptOrDecline: "accept" },
        { Status: "pending" },
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