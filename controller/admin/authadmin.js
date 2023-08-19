const User = require("../../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');



exports.registrationAdmin = async (req, res) => {
  try {
    const { AdminName, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    console.log(hashedPassword);

    var user = await User.findOne({ email: email, userType: "admin" });

    if (!user) {
      req.body.userType = "admin";

      const userCreate = await User.create({
        AdminName,
        email,
        password: hashedPassword, // Store the hashed password
        userType : "admin"
      });

      let obj = {
        id: userCreate._id,
        AdminName: userCreate.AdminName,
        email: userCreate.email,
        userType: req.body.userType
      };

      res.status(200).send({
        status: 200,
        message: "Registered successfully",
        data: obj
      });
    } else {
      return res.status(409).send({ status: 409, msg: "Already Exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// exports.sendotpEmployer = async (req, res) => {
//   console.log("hi");
//   try {
//     const { phoneNumber } = req.body

//     var user = await User.findOne({ mobile: phoneNumber, userType: "employer" })
//     if (!user) {
//     // Generate a random 6-digit OTP
//     const otp = Math.floor(1000 + Math.random() * 9000);

//     // Create and send the SMS with the OTP
//     await client.messages.create({
//       to: phoneNumber,
//       from: twilioPhoneNumber,
//       body: `Your OTP is: ${otp}`,
//     });

//     res.status(200).json({ message: "OTP sent successfully" });
//   }
//   else {
//     return res.status(409).send({ status: 409, msg: "Already Exit" });
//   }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to send OTP" });
//   }
// }



// exports.updateEmployer = async (req, res) => {
//   const employerId = req.params.id;

//   try {
//     const updatedData = {
//       employerName: req.body.employerName,
//       active: req.body.active,
//       gender: req.body.gender,
//       email: req.body.email,
//       createdAt: req.body.createdAt,
//       state: req.body.state,
//       city: req.body.city,
//       GST_Number: req.body.GST_Number,
//       registration_Number: req.body.registration_Number,  
//       aadharCard: req.body.aadharCard, // Updated field
//       panCard: req.body.panCard, // Updated field
//     };

//     const updatedEmployer = await User.findByIdAndUpdate(employerId, updatedData, { new: true });

//     if (!updatedEmployer) {
//       return res.status(404).json({ msg: 'Employer not found' });
//     }

//     return res.status(200).json({ updatedEmployer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: 'An error occurred', error: err.message });
//   }
// }



// exports.getAllEmployer = async (req, res) => {
//   try {
//     const employers = await User.find({}, '_id mobile otp obj createdAt updatedAt');

//     if (employers.length === 0) {
//       return res.status(404).json({ error: "No employer data found." });
//     }

//     res.status(200).json({ success: true, data: employers });
//   } catch (err) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// }



// exports.getAllEmployerById = async (req, res) => {
//   try {
//     const Employer = await User.findOne({ _id: req.params.id })
//     if (!Employer) {
//       return res.status(400).json({ error: "Employer data not provided" });
//     }
//     res.status(201).json({ success: true, data: Employer })
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }



exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email ) {
      return res
        .status(400)
        .json({ error: "email required" });
    }

    const admin = await User.findOne({ email:email , userType: "admin"});
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }


    const token = jwt.sign({ admin: admin._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      data: {
        email, 
        token
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

