const express = require('express');
const router = express.Router();
const ratingController = require('../controller/ratingModel'); // Import the ratingController module

// Create a new rating
router.post('/ratings', ratingController.createRating);
// router.post('/createEmployer/Rating', ratingController.createEmployerRating);

// Get all ratings for a specific employer
// router.get('/ratings/employer/:employerId', ratingController.getAllRatings);
// router.put('/ratings/employer/:employerId', ratingController.updateEmployerRatings);


module.exports = router;
