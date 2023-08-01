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
      // employerId,
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
    
    let orderId = await reffralCode();
    
    // You can add validation for the input data if required
    // For example, check if required fields are present, validate the amount, etc.

    // Create a new payment instance using the Payment model
    const newPayment = new paymentModel({
      bookingId,
      // employerId,
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
    return res.status(200).json({ details: Data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};








// exports.CreatePaymentOrder = async (req, res) => {
//   try {
//     const bookingData = await booking.findById({ _id: req.params.id });

//     if (!bookingData || bookingData.length == 0) {
//       return res.status(500).json({
//         message: "No Booking  is their",
//       });
//     }

//     console.log(bookingData.amount);
//     const b = bookingData.amount;  
//     console.log(b);
//     console.log(bookingData.userId);
//     console.log(bookingData.heroId);
//     console.log(bookingData.userobject.wallet);

//     const userdata = await userSchema.findById({ _id: bookingData.userId });

//     if (!userdata || userdata.length == 0) {
//       return res.status(500).json({
//         message: "No userdata  is their",
//       });
//     }
//     console.log(userdata.wallet);

//     const walletdata = await Wallet.findOne({ user: bookingData.userId });
//     if (!walletdata || walletdata.length == 0) {
//       return res.status(500).json({
//         message: "No walletdata  is their",
//       });
//     }
//     console.log(walletdata);
//     console.log(walletdata.balance);

//     if (
//       bookingData.amount < walletdata.balance ||
//       (bookingData.amount = walletdata.balance)
//     ) {
//       console.log(parseInt(walletdata.balance));

//       const data1 = {
//         amount: bookingData.amount * 100,
//         currency: "INR",
//         receipt: id,
//         partial_payment: false,
//       };
//       console.log(data1.receipt);
//       const result1 = await Razorpay.orders.create(data1);
//       console.log(result1);
//       // console.log(result1.data1.amount)

//       const DBData = {
//         orderId: result1.id,
//         name: req.body.name,
//         invoice: "123" + req.body.name,
//         // amount: bookingData.userobject.wallet,
//         amount: result1.amount,
//         currency: "INR",
//         receipt: result1.receipt,
//         partial_payment: false,
//         user: bookingData.userobject._id,
//         userName: bookingData.userobject.name,
//         hero: bookingData.heroobject[0]._id,
//         heroName: bookingData.heroobject[0].name,

//         //  payment_Id: result1.id,
//         //  amount: result1.amount,
//         //  amount_paid: result1.amount_paid,
//         //  receipt: result1.receipt,
//         //  product: req.body.product,
//         status: req.body.status,
//       };
//       console.log(DBData);
//       const AmountData = await payment.create(DBData);

//       //console.log(AmountData);
//       // const AmountData = await payment.create(data1);
//       bookingData.Status = "success";
//       walletdata.balance = walletdata.balance - bookingData.amount;
//       console.log(walletdata.balance);
//       await walletdata.save();

//       userdata.wallet = walletdata.balance;
//       await userdata.save();
//       //bookingData.amount = bookingData.userobject.wallet;
//       await bookingData.save();
//       return res.status(200).json(AmountData);
//     } else {
//       console.log(b);
//       walletdata.balance = b;
//       console.log(walletdata.balance);

//       // walletdata.balance = parseInt(walletdata.balance) - parseInt(bookingData.amount)

//       const data1 = {
//        amount: walletdata.balance * 100,
//         currency: "INR",
//         receipt: id,
//         partial_payment: false,
//       };
//       console.log(data1);
//       const result1 = await Razorpay.orders.create(data1);
//       console.log(result1);
//       // console.log(result1.data1.amount)

//       const DBData = {
//         orderId: result1.id,
//         name: req.body.name,
//         invoice: "123" + req.body.name,
//         // amount: bookingData.userobject.wallet,
//         amount: result1.amount,
//         currency: "INR",
//         receipt: result1.receipt,
//         partial_payment: false,
//         user: bookingData.userId._id,
//         userName: bookingData.userobject.name,
//         hero: bookingData.heroId._id,
//         heroName: bookingData.heroobject.name,

//         //  payment_Id: result1.id,
//         //  amount: result1.amount,
//         //  amount_paid: result1.amount_paid,
//         //  receipt: result1.receipt,
//         //  product: req.body.product,
//         status: req.body.status,
//       };
//       console.log(DBData);
//       const AmountData = await payment.create(DBData);

//       //console.log(AmountData);
//       // const AmountData = await payment.create(data1);
//       walletdata.balance = 0;
//       await walletdata.save();

//       userdata.wallet = 0;
//       await userdata.save();
//       bookingData.amount = b;
//       bookingData.Status = "success";
//       // await b.save()
//       //bookingData.amount = bookingData.userobject.wallet;
//       await bookingData.save();
//       return res.status(200).json(AmountData);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ message: err.message });
//   }
// };
