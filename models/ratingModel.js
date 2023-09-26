const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User", // Replace with the actual User model reference
    required: true,
  },
  target: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User", // Replace with the actual User model reference
    required: true,
  },
  userType:{
    type:String
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Define the minimum rating value
    max: 5, // Define the maximum rating value
  },
  comment: {
    type: String,
    trim: true, // Removes leading/trailing whitespace
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
