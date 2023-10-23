const express = require('express');
const router = express.Router();
const cityController = require('../controller/selectcity');

// CREATE a new city
router.post('/create', cityController.createCity);

// READ all cities
router.get('/', cityController.getCity);
router.get('/getCityBystateId/:stateId', cityController.getCityBystateId);

// UPDATE a city
router.put('/:id', cityController.updateCity);

// DELETE a city
router.delete('/:id', cityController.deleteCity);

router.get('/get/getCityBySelectCity/:selectcity', cityController.getCityBySelectCity);

router.get('/get/getCitiesByStateName/:stateName', cityController.getCitiesByStateName);

module.exports = router;
