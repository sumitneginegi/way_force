const User = require("../../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');

const reffralCode = async () => {
    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let OTP = "";
    for (let i = 0; i < 9; i++) {
      OTP += digits[Math.floor(Math.random() * 36)];
    }
    return OTP;
  }



exports.registrationSubAdmin = async (req, res) => {
  try {
    const { SubAdminName, email, password } = req.body;


    if (!SubAdminName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    console.log(hashedPassword);

    var user = await User.findOne({ email: email, userType: "subadmin" });

    if (!user) {
      req.body.userType = "subadmin";

      const userCreate = await User.create({
        SubAdminName,
        email,
        wallet : 0 ,
        password: hashedPassword, // Store the hashed password
        userType : "subadmin"
      });

      let obj = {
        id: userCreate._id,
        SubAdminName: userCreate.SubAdminName,
        email: userCreate.email,
        userType: req.body.userType
      };

      res.status(200).json({
        status: 200,
        message: "Registered successfully",
        data: obj
      });
    } else {
      return res.status(409).json({ status: 409, msg: "Already Exist" });
    }
  } catch (error) {
    console.error/8520(error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.loginSubAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const subadmin = await User.findOne({ email, userType: "subadmin" });

    if (!subadmin) {
      return res.status(404).json({ error: "SubAdmin not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = bcrypt.compare(password, subadmin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If the password is valid, create a JSON Web Token (JWT)
    const token = jwt.sign({ subadmin: subadmin._id }, process.env.JWT_SECRET);

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




exports.updateSubAdmin = async (req, res) => {
    try {
        const { SubAdminName,gender,mobile,email, } = req.body;

        let orderId = await reffralCode()
        const user = await User.findById({_id:req.params.id});
        if (!user) {
            return res.status(404).send({ message: "user not found" });
        }
        user.SubAdminName = SubAdminName || user.SubAdminName;
        user.orderId = orderId || user.orderId;
        user.gender = gender || user.gender;
        user.email = email || user.email;
        user.mobile = mobile || user.mobile;
        // if (req.body.password) {
        //     user.password = bcrypt.hashSync(password, 8) || user.password;
        // }
        const updated = await user.save();
        res.status(200).send({ message: "updated", data: updated });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "internal server error " + err.message,
        });
    }
  };



  exports.getAllSubAdmin = async (req, res) => {
  try {
    const Subadmin = await User.find({userType:"subadmin"});

    if (Subadmin.length === 0) {
      return res.status(404).json({ error: "No SubAdmin data found." });
    }

    res.status(200).json({ success: true, data: Subadmin });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
  
