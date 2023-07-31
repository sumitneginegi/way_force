const express = require('express');
const router = express.Router();
const stateController = require('../controller/state')

// CREATE a new city
router.post('/', stateController.createState)

// READ all cities
router.get('/', stateController.getState)

// UPDATE a city
router.put('/:id', stateController.updateState)

// DELETE a city
router.delete('/:id', stateController.deleteState)

module.exports = router


