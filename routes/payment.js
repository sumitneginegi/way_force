const express = require('express');
const  payment = require('../controller/payment')

const paymentRouter = express();

//customer
paymentRouter.post('/employer', payment.CreatePaymentOrder),
paymentRouter.get('/Get/AllPayment', payment.GetAllPayments)
paymentRouter.get('/Get/PaymentsById/:id', payment.GetAllPaymentsById)
paymentRouter.get('/Get/GetAllPaymentsByEmployerId/:id', payment.GetAllPaymentsByEmployerId)
paymentRouter.delete('/delete/deletePayment/:id', payment.deletePayment)

//-----------------------PAYMENT OF INSTANT-------------------------------//

paymentRouter.post('/create/PaymentforInstant', payment.createPaymentforInstant),
paymentRouter.put('/put/updatePaymentStatus/:orderId', payment.updatePaymentStatus),

module.exports = paymentRouter;