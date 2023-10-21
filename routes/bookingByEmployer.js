const express = require('express')

const { createBookingByEmployer,getEmployersWhoBookedManpower,getBookingByManpower,deleteBooking,calculateTimeDifferenceController,changeStatusbyIdBooking,getbookingbyidbycustomerbyAdmin,getbookingbyidbyHeroIdbyAdmin,changeStatusbyidByAdmin} = require('../controller/bookingByEmployer')

const bookingRouter = express.Router()

// //CUSTOMER
bookingRouter.post('/', /*Auth*/  createBookingByEmployer)
// bookingRouter.get('/', /*Auth*/  getBookingByEmployer)
bookingRouter.get('/get/getEmployersWhoBookedManpower/:manpowerUserId', /*Auth*/  getEmployersWhoBookedManpower)
bookingRouter.get('/get/BookingByManpower/:manpowerId', /*Auth*/  getBookingByManpower)
bookingRouter.delete('/delete/deleteBooking/:Bookingg', /*Auth*/  deleteBooking)
//  bookingRouter.post('/calculateTimeDifferenceController', /*Auth*/  calculateTimeDifferenceController)
// bookingRouter.get('/getbookingsbyId/:id', /*Auth*/  getbookingsbyId)
// // bookingRouter.get('/timer', /*Auth*/  timer)




module.exports = bookingRouter
