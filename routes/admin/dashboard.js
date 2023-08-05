const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin/dashboard');

// Route to get total employer and manpower
router.get('/get/TotalEmployerAndManpower', userController.getDashboard);

module.exports = router;
