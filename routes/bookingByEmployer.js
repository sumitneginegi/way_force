const express = require('express')

const { createBookingByEmployer,
    getEmployersWhoBookedManpower,
    getBookingByManpower,
    deleteBooking,
    updateBookingAcceptOrDecline,
    scheduleBooking,
    sendNotificationForTodayDate,
    getOngoingBookings,
    sendNotificationOfBookingToParticularEmployer,
    generate_otp,
    calculateTimeDifferenceController,
    changeStatusbyIdBooking,
    getbookingbyidbycustomerbyAdmin,
    getbookingbyidbyHeroIdbyAdmin,getbookings,
    verifyOTP,
    changeStatusbyidByAdmin,
    updateStatusToCompleted,
    getBookingById,
    updatePaymentStatus,
    scheduleBookingOfEmployer} = require('../controller/bookingByEmployer')

const bookingRouter = express.Router()

// //CUSTOMER
bookingRouter.post('/', /*Auth*/  createBookingByEmployer)
// bookingRouter.get('/', /*Auth*/  getBookingByEmployer)
bookingRouter.get('/get/getEmployersWhoBookedManpower/:manpowerUserId', /*Auth*/  getEmployersWhoBookedManpower)
bookingRouter.get('/get/BookingByManpower/:manpowerId', /*Auth*/  getBookingByManpower)
bookingRouter.delete('/delete/deleteBooking/:Bookingg', /*Auth*/  deleteBooking)
bookingRouter.put('/update/updateBookingAcceptOrDecline', /*Auth*/  updateBookingAcceptOrDecline)
bookingRouter.get('/get/scheduleBooking/:id', /*Auth*/  scheduleBooking)
bookingRouter.post('/get/sendNotificationForTodayDate', /*Auth*/  sendNotificationForTodayDate)
// bookingRouter.post('/post/sendNotificationOfBookingToParticularEmployer', /*Auth*/  sendNotificationOfBookingToParticularEmployer)
bookingRouter.get('/get/getbookings/:bookingId', /*Auth*/  getbookings)
bookingRouter.put('/update/generate_otp/:bookingId', /*Auth*/  generate_otp)
bookingRouter.post('/post/verifyOTP/:employerId', /*Auth*/  verifyOTP)
bookingRouter.get('/get/OngoingBookings', /*Auth*/  getOngoingBookings)
bookingRouter.put('/update/StatusToCompleted/:id', /*Auth*/  updateStatusToCompleted)
bookingRouter.get('/get/getBookingById/:bookingId', /*Auth*/  getBookingById)
bookingRouter.put('/update/updatePaymentStatus/:bookingId', /*Auth*/  updatePaymentStatus)


bookingRouter.get('/get/scheduleBookingOfEmployer/:id', /*Auth*/  scheduleBookingOfEmployer)



//  bookingRouter.post('/calculateTimeDifferenceController', /*Auth*/  calculateTimeDifferenceController)
// bookingRouter.get('/getbookingsbyId/:id', /*Auth*/  getbookingsbyId)
// // bookingRouter.get('/timer', /*Auth*/  timer)




module.exports = bookingRouter
