const express = require('express');
const router = express.Router();
const Rating = require('../models/ratingModel'); // Import the Rating model
const User = require("../models/user")




// Controller function to create a new rating
exports.createRating = async (req, res) => {
  try {
    const { user, target, rating, comment } = req.body;

    // Check if a rating from the same user to the same target already exists
    const existingRating = await Rating.findOne({ user, target });

    if (existingRating) {
      return res.status(400).json({ message: "You have already given a review to this target" });
    }

    // Create a new rating instance
    const newRating = new Rating({ user, target, rating, comment });

    // Save the rating to the database
    await newRating.save();

    await updateEmployerRatings(target);

    return res.status(201).json({ message: "Rating created successfully", rating: newRating });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ message: "Rating creation failed" });
  }
};




// Function to update manpower's average and total rating
async function updateEmployerRatings(target) {
  try {
    const ratings = await Rating.find({ target })

    // Calculate the new total rating
    let totalRating = 0;
    let totalRatingsCount = 0;
    ratings.forEach((rating) => {
      totalRating += rating.rating;
      totalRatingsCount++;
    });

    const averageRating = totalRating / totalRatingsCount;

    // Update the manpower's average rating in the database
    await User.updateOne({ _id: target }, { averageRating:averageRating });
  } catch (err) {
    console.error(err);
    throw err;
  }
}
















// // Create a new rating
// exports.createRating = async (req, res) => {
//   try {
//     const { employerId, manpowerId, rating, comment, date } = req.body;

//     // Check if a review from the same manpower for the same employer already exists
//     const existingRating = await Rating.findOne({
//       employerId,
//       manpowerId,
//     });

//     if (existingRating) {
//       // If a review exists, return an appropriate response
//       return res.status(400).json({ error: 'You have already given a review for this employer.' });
//     }

//     // Create a new rating object
//     const newRating = new Rating({
//       employerId,
//       manpowerId,
//       rating,
//       comment,
//       date,
//     });

//     // Save the rating to the database
//     await newRating.save();

//     // Update the average and total rating for the employer
//     await updateEmployerRatings(employerId);

//     // Update the employer's average rating
//     // await updateEmployerAverageRating(employerId);

//     return res.status(201).json(newRating);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };



// // Function to update employer's average and total rating
// async function updateEmployerRatings(employerId) {
//   try {
//     const ratings = await Rating.find({ employerId });
// console.log(ratings);
//     // Calculate the new total rating
//     let totalRating = 0;
//     let totalRatingsCount = 0;
//     // ratings.forEach((rating) => {
//     //   rating.forEach((userRating) => {
//     //     totalRating += userRating.rating;
//     //     totalRatingsCount++;
//     //   });
//     // });
//     // let totalRating = 0;
//     ratings.forEach((rating) => {
//       totalRating += rating.rating;
//       totalRatingsCount++;
//     });
// console.log(totalRatingsCount);
// const averageRating = totalRating / totalRatingsCount

// // Update the employer's average rating in the database
// await User.updateOne({ _id: employerId }, { averageRating:averageRating });
//     // Update the employer's total rating in the database
//     // await User.updateOne({ _id: employerId }, { totalRating: totalRating });
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }





// // Create a new rating (employer rating manpower)
// exports.createEmployerRating = async (req, res) => {
//   try {
//     const { employerId, manpowerId, rating, comment, date } = req.body;

//     // Check if a review from the same employer for the same manpower already exists
//     const existingRating = await Rating.findOne({
//       employerId,
//       manpowerId,
//     });

//     if (existingRating) {
//       // If a review exists, return an appropriate response
//       return res.status(400).json({ error: 'You have already given a review for this manpower.' });
//     }

//     // Create a new rating object
//     const newRating = new Rating({
//       employerId,
//       manpowerId,
//       rating,
//       comment,
//       date,
//     });

//     // Save the rating to the database
//     await newRating.save();

//     // Update the average and total rating for the manpower
//     await updateManpowerRatings(manpowerId);

//     return res.status(201).json(newRating);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// // Function to update manpower's average and total rating
// async function updateManpowerRatings(manpowerId) {
//   try {
//     const ratings = await Rating.find({ manpowerId });

//     // Calculate the new total rating
//     let totalRating = 0;
//     let totalRatingsCount = 0;
//     ratings.forEach((rating) => {
//       totalRating += rating.rating;
//       totalRatingsCount++;
//     });

//     const averageRating = totalRating / totalRatingsCount;

//     // Update the manpower's average rating in the database
//     await User.updateOne({ _id: manpowerId }, { averageRating:averageRating });
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// }
