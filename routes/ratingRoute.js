const express = require('express');
const router = express.Router();
const ratingController = require('../controller/ratingModel'); // Import the ratingController module

// Create a new rating
router.post('/ratings', ratingController.createRating);
// router.post('/createEmployer/Rating', ratingController.createEmployerRating);

// Get all ratings for a specific employer
router.get('/get/comment/:targetId', ratingController.getCommentOfManpower);
router.get('/get/comment/employer/:targetId', ratingController.getCommentOfEmployer);
// router.put('/ratings/employer/:employerId', ratingController.updateEmployerRatings);


module.exports = router;
