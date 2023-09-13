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




  exports.getComment = async (req, res) => {
  try {
    const targetId = req.params.targetId;

    // Find all ratings with the specified target ID
    const ratings = await Rating.find({ target: targetId });

    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: "No comments found for the specified target" });
    }

    // Extract comments from the ratings
    const comments = ratings.map((rating) => ({
      user: rating.user, // You can also populate user details if needed
      comment: rating.comment,
    }));

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ message: "Failed to retrieve comments" });
  }
  }

