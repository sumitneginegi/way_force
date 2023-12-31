const express = require('express');
const router = express.Router();
const subadminController = require('../../controller/subadmin/authsubadmin')
const verifyToken = require('../../middleware/auth')

// CREATE a new city
router.post('/', subadminController.registrationSubAdmin)

router.post('/loginSubAdmin', subadminController.loginSubAdmin)

// READ all cities
router.get('/', subadminController.getAllSubAdmin)

// // UPDATE a city
router.put('/:id', subadminController.updateSubAdmin)

// // DELETE a city
router.get('/getSubAdminById/:id', subadminController.getSubAdminById)

router.delete('/delete/SubAdmin/:id', subadminController.DeleteSubAdmin)
// 

module.exports = router
