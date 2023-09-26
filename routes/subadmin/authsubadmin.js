const express = require('express');
const router = express.Router();
const subadminController = require('../../controller/subadmin/authsubadmin')
const verifyToken = require('../../middleware/auth')

// CREATE a new city
router.post('/', subadminController.registrationSubAdmin)

router.post('/loginSubAdmin', subadminController.loginSubAdmin)

// READ all cities
// router.get('/', stateController.getState)

// // UPDATE a city
// router.put('/:id', stateController.updateState)

// // DELETE a city
// router.delete('/:id', stateController.deleteState)

module.exports = router
