const express = require('express');
const  payment = require('../controller/payment')

const paymentRouter = express();

//customer
paymentRouter.post('/employer', payment.CreatePaymentOrder),
// paymentRouter.get('/payment/:id', customer.GetPaymentsByUserId)


// //admin
// paymentRouter.get('/GetPaymentsById/:id', payment.GetPaymentsById)
// paymentRouter.get('/users/getAllPayments', payment.getAllPayments)
// paymentRouter.get('/GetPaymentsByUserId/:user', payment.GetPaymentsByUserIdAdmin)
// paymentRouter.put('/changeStatusbyidByAdmin/:id', /*Auth*/ payment.changeStatusbyidByAdmin)


module.exports = paymentRouter;