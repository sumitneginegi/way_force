const express = require('express');
const  payment = require('../controller/payment')

const paymentRouter = express();

//customer
paymentRouter.post('/employer', payment.CreatePaymentOrder),
paymentRouter.get('/Get/AllPayment', payment.GetAllPayments)
paymentRouter.get('/Get/PaymentsById/:id', payment.GetAllPaymentsById)
paymentRouter.get('/Get/GetAllPaymentsByEmployerId/:id', payment.GetAllPaymentsByEmployerId)


// //admin
// paymentRouter.get('/GetPaymentsById/:id', payment.GetPaymentsById)
// paymentRouter.get('/users/getAllPayments', payment.getAllPayments)
// paymentRouter.get('/GetPaymentsByUserId/:user', payment.GetPaymentsByUserIdAdmin)
// paymentRouter.put('/changeStatusbyidByAdmin/:id', /*Auth*/ payment.changeStatusbyidByAdmin)


module.exports = paymentRouter;