const express = require('express')

const { createBookingByEmployer,getBookingByEmployer,getBookingByManpower,deleteBooking,calculateTimeDifferenceController,changeStatusbyIdBooking,getbookingbyidbycustomerbyAdmin,getbookingbyidbyHeroIdbyAdmin,changeStatusbyidByAdmin} = require('../controller/bookingByEmployer')

const bookingRouter = express.Router()

// //CUSTOMER
bookingRouter.post('/', /*Auth*/  createBookingByEmployer)
bookingRouter.get('/getBookingByEmployer/:employerId', /*Auth*/  getBookingByEmployer)
bookingRouter.get('/getBookingByManpower/:manpowerId', /*Auth*/  getBookingByManpower)
bookingRouter.delete('/delete/deleteBooking/:Bookingg', /*Auth*/  deleteBooking)
//  bookingRouter.post('/calculateTimeDifferenceController', /*Auth*/  calculateTimeDifferenceController)
// bookingRouter.get('/getbookingsbyId/:id', /*Auth*/  getbookingsbyId)
// // bookingRouter.get('/timer', /*Auth*/  timer)

//ADMIN
// bookingRouter.get('/getbook', /*Auth*/  getbookingsbyadmin)
// bookingRouter.put('/updatebook/:id', /*Auth*/  updatebook)
// bookingRouter.get('/getbookingbyid/:id', /*Auth*/  getbookingbyid)
// bookingRouter.delete('/deletebookingbyadmin/:id', /*Auth*/  deletebookingbyadmin)
// bookingRouter.put('/changeStatusbyIdBooking/:id', /*Auth*/  changeStatusbyIdBooking)
// bookingRouter.get('/getbookingbyidbycustomerbyAdmin/:id', /*Auth*/  getbookingbyidbycustomerbyAdmin)
// bookingRouter.get('/getbookingbyidbyHeroIdbyAdmin/:id', /*Auth*/  getbookingbyidbyHeroIdbyAdmin)//



module.exports = bookingRouter
