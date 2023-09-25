const express = require('express');
const router = express.Router();
const adminController = require('../../controller/admin/authadmin')
const verifyToken = require('../../middleware/auth')

// CREATE a new city
router.post('/', adminController.registrationAdmin)

router.post('/loginAdmin', adminController.loginAdmin)

// READ all cities
// router.get('/', stateController.getState)

// // UPDATE a city
// router.put('/:id', stateController.updateState)

// // DELETE a city
// router.delete('/:id', stateController.deleteState)

module.exports = router
