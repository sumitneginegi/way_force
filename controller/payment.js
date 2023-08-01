const razerpay = require("razorpay");
const crypto = require("crypto");
const uuid = require("uuid");
const id = uuid.v4();
const paymentModel = require("../models/payment");
const bookingModel = require("../models/bookingByEmployer");
const userModel = require("../models/user");

// const Razorpay = new razerpay({
//   key_id: "",
//   key_secret: "",
// });


const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = "";
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
};


exports.CreatePaymentOrder = async (req, res) => {
  try {
    const {
      bookingId,
      employerId,
      status,
      // receipt,
      amount,
      name,
      date,
      paymentMethod,
    } = req.body;

    const bookingData = await paymentModel.findOne({ bookingId:bookingId });

        if (bookingData ) {
          return res.status(500).json({
            message: "Booking  already their",
          });
        }
    
    let orderId = await reffralCode()
    
    // You can add validation for the input data if required
    // For example, check if required fields are present, validate the amount, etc.

    // Create a new payment instance using the Payment model
    const newPayment = new paymentModel({
      bookingId,
      employerId,
      status,
      // receipt,
      amount,
      name,
      date,
      paymentMethod,
    });
    console.log(newPayment);
    // Generate an order id from Razorpay
    // const options = {
    //   amount: amount * 100, // Amount in paise (multiply by 100 as Razorpay expects the amount in paise)
    //   currency: "INR",
    //   receipt: receipt,
    // };

    // const order = await Razorpay.orders.create(options);

    // Save the Razorpay order id to the payment document
    // newPayment.razorpayOrderId = order.id;

    newPayment.razorpayOrderId = orderId;

    // Save the new payment to the database
    const savedPayment = await newPayment.save();

    // Send the Razorpay order id to the client
    res.status(201).json({ orderId: orderId});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment" });
  }
}


exports.GetAllPayments = async (req, res) => {
  try {
    const Data = await paymentModel.find()

    if (!Data || Data.length==0) {
      return res.status(500).json({
        message: "payment data not present",
      });
    }
    return res.status(200).json({ details: Data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


exports.GetAllPaymentsById = async (req, res) => {
  try {
    const Data = await paymentModel.findById({_id:req.params.id})
    if (!Data || Data.length==0) {
      return res.status(500).json({
        message: "payment data not present",
      });
    }
    return res.status(200).json({ details: Data })
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


exports.GetAllPaymentsByEmployerId = async (req, res) => {
  try {
    const employerId = req.params.id;

    // Use .populate() to replace bookingId reference with actual data from bookingByEmployer model
    const payments = await paymentModel.find({ employerId })
      .populate("employerId")

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        message: "No payments found for the specified employer ID",
      });
    }

    return res.status(200).json({ details: payments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.deletePayment = async (req, res) => {
  try {
    const { Payment } = req.params

    const deletedPayment = await paymentModel.findByIdAndRemove(Payment);

    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found.' });
    }

    res.json({ message: 'Payment deleted successfully.' })
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'An error occurred while deleting the Payment.' });
  }
}