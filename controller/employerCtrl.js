const Employerr = require("../models/employerModel");
const Manpowerr = require("../models/ManPowerModel");
const OTP = require("../config/OTP-Generate");
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const twilio = require("twilio");
// var newOTP = require("otp-generators");

const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = "";
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
};


const accountSid = "AC0f17e37b275ea67e2e66d289b3a0ef84";
const authToken = "9d20fa9d3a465dc7de999b0b3de610e0";
const twilioPhoneNumber = "+14708354405";
const client = twilio(accountSid, authToken);


exports.registrationEmployer = async (req, res) => {
  try {
    var { mobile, otp } = req.body
    var user = await User.findOne({ mobile: mobile, userType: "employer" })

    if (!user) {
      // req.body.otp = OTP.generateOTP()
      // req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000)
      // req.body.accountVerification = false
      req.body.userType = "employer"

      // let referalUser = null;

      const userCreate = await User.create({
        mobile,
        otp,
        // referalCodeUnique,
        ...req.body
      })

      let obj = {
        id: userCreate._id,
        otp: userCreate.otp,
        mobile: userCreate.mobile,
      };

      res.status(200).send({
        status: 200,
        message: "Registered successfully ",
        data: obj
      });
    } else {
      return res.status(409).send({ status: 409, msg: "Already Exit" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.sendotpEmployer = async (req, res) => {
  console.log("hi");
  try {
    const { phoneNumber } = req.body;

    // Generate a random 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Create and send the SMS with the OTP
    await client.messages.create({
      to: phoneNumber,
      from: twilioPhoneNumber,
      body: `Your OTP is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}


exports.signupEmployer = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const existingMobile = await Employerr.findOne({ mobile });
    if (existingMobile) {
      return res.status(409).json({ error: "Mobile number already in use" });
    }

    const otp = OTP.generateOTP();

    const newEmployerr = new Employerr({ mobile, otp });
    await newEmployerr.save();

    res.status(201).json({
      message: "Sign up successful",
      data: newEmployerr,
      otp: otp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.verifyOtpEmployer = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await Employerr.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otpFromDb = user.otp;
    console.log(otp);
    if (!otpFromDb || otpFromDb !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    // user.otp = null;
    user.mobileVerified = true;
    await user.save();
    return res.status(200).json({ message: "verified successfully" });
  } catch (err) {
    console.error(err);
    return createResponse(res, 500, "Internal server error");
  }
};

// exports.detailDirectEmployer = async (req, res) => {
//   try {
//     const {
//       mobile,
//       job_desc,
//       city,
//       siteLocation,
//       employmentType,
//       category,
//       no_Of_opening,
//       fullTime,
//       miniSalary,
//       maxSalary,
//       workingDays,
//       workingHours,
//       explainYourWork,
//       date,
//       // manpowerId,
//       mobileVerified,
//       instantOrdirect

//     } = req.body;

//     let employer = await Employerr.findOne({ mobile });

//     if (!employer) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     employer.mobile = mobile;
//     employer.job_desc = job_desc;
//     employer.city = city;
//     employer.siteLocation = siteLocation;
//     employer.employmentType = employmentType;
//     employer.category = category;
//     employer.no_Of_opening = no_Of_opening;
//     employer.fullTime = fullTime;
//     employer.miniSalary = miniSalary;
//     employer.maxSalary = maxSalary;
//     employer.workingDays = workingDays;
//     employer.workingHours = workingHours;
//     employer.explainYourWork = explainYourWork;
//     employer.date = date;
//     // employer.manpowerId = manpowerId;
//     employer.mobileVerified = mobileVerified;
//     employer.instantOrdirect = instantOrdirect,

//       await employer.save();

//     res
//       .status(200)
//       .json({ message: "Details filled successfully", data: employer });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "Something went wrong"
//     });
//   }
// }

// exports.detailDirectEmployer = async (req, res) => {
//   try {
//     const data = {
//       // mobile: req.body.mobile,
//       job_desc: req.body.job_desc,
//       city: req.body.city,
//       siteLocation: req.body.siteLocation,
//       employmentType: req.body.employmentType,
//       category: req.body.category,
//       no_Of_opening: req.body.no_Of_opening,
//       fullTime: req.body.fullTime,
//       miniSalary: req.body.miniSalary,
//       maxSalary: req.body.maxSalary,
//       workingDays: req.body.workingDays,
//       workingHours: req.body.workingHours,
//       explainYourWork: req.body.explainYourWork,
//       date: req.body.date,
//       // manpowerId: req.body.manpowerId,
//       mobileVerified: req.body.mobileVerified,
//       instantOrdirect: req.body.instantOrdirect
//     }

//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Push the new document into the documents array
//     user.documents.push(data);

//     // Save the updated user document
//     await user.save();

//     res.status(201).json(user);


//     const updatedEmployer = await User.findByIdAndUpdate(
//       { _id: req.params.id },
//       {
//         $push: {
//           // mobile: data.mobile,
//           job_desc: data.job_desc,
//           city: data.city,
//           siteLocation: data.siteLocation,
//           employmentType: data.employmentType,
//           category: data.category,
//           no_Of_opening:data.no_Of_opening,
//           fullTime:data.fullTime,
//           miniSalary: data.miniSalary,
//           maxSalary: data.maxSalary,
//           workingDays:data.workingDays,
//           workingHours: data.workingHours,
//           explainYourWork: data.explainYourWork,
//           date: data.date,
//           // manpowerId: data.manpowerId,
//           mobileVerified: data.mobileVerified,
//           instantOrdirect: data.instantOrdirect
//         },
//       },
//       { new: true }
//     );

//     res.status(201).json(updatedEmployer);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

exports.detailDirectEmployer = async (req, res) => {
  try {
    let orderId = await reffralCode()
    const data = {
      // mobile: req.body.mobile,
      job_desc: req.body.job_desc,
      city: req.body.city,
      siteLocation: req.body.siteLocation,
      employmentType: req.body.employmentType,
      category: req.body.category,
      no_Of_opening: req.body.no_Of_opening,
      fullTime: req.body.fullTime,
      miniSalary: req.body.miniSalary,
      maxSalary: req.body.maxSalary,
      workingDays: req.body.workingDays,
      workingHours: req.body.workingHours,
      explainYourWork: req.body.explainYourWork,
      date: req.body.date,
      // manpowerId: req.body.manpowerId,
      mobileVerified: req.body.mobileVerified,
      instantOrdirect: "Direct",
      orderId: orderId
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Push the new document into the documents array
    user.obj.push(data);

    // Save the updated user document
    await user.save();

    res.status(201).json(user);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.detailInstantEmployer = async (req, res) => {
  try {
    let orderId = await reffralCode()
    const data = {
      // mobile: req.body.mobile,
      job_desc: req.body.job_desc,
      city: req.body.city,
      siteLocation: req.body.siteLocation,
      employmentType: req.body.employmentType,
      category: req.body.category,
      no_Of_opening: req.body.no_Of_opening,
      fullTime: req.body.fullTime,
      miniSalary: req.body.miniSalary,
      maxSalary: req.body.maxSalary,
      workingDays: req.body.workingDays,
      workingHours: req.body.workingHours,
      explainYourWork: req.body.explainYourWork,
      date: req.body.date,
      // manpowerId: req.body.manpowerId,
      mobileVerified: req.body.mobileVerified,
      state: req.body.state,
      pinCode: req.body.pinCode,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      lati: req.body.lati,
      longi: req.body.longi,
      instantOrdirect: "instant",
      orderId: orderId
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Push the new document into the documents array
    user.obj.push(data);

    // Save the updated user document
    await user.save();

    res
      .status(200)
      .json({ message: "Details filled successfully", data: user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong" });
  }
}


exports.getUsersByInstantOrDirect = async (req, res) => {
  try {
    const instantOrdirectValue = req.params.value;

    const users = await User.aggregate([
      {
        $match: { "obj.instantOrdirect": instantOrdirectValue },
      },
      {
        $project: {
          mobile: 1,
          obj: {
            $filter: {
              input: "$obj",
              as: "item",
              cond: { $eq: ["$$item.instantOrdirect", instantOrdirectValue] },
            },
          },
        },
      },
    ]);

    res.status(200).json(users);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getAllEmployer = async (req, res) => {
  try {
    const employer = await User.find()
    if (!employer) {
      return res.status(400).json({ error: "Employer data not provided" });
    }
    res.status(201).json({ success: true, data: employer })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllEmployerById = async (req, res) => {
  try {
    const Employer = await Employerr.find({ _id: req.params.id })
    if (!Employer) {
      return res.status(400).json({ error: "Employer data not provided" });
    }
    res.status(201).json({ success: true, data: Employer })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// exports.getInstanOrDirect = async (req, res) => {
//   try {
//     const { instantOrdirect } = req.query;

//     // Build the filter object based on the provided query parameters
//     const filter = {}
//     // if (city) filter.city = city;
//     // if (category) filter.category = category;
//     // if (employmentType) filter.employmentType = employmentType;
//     if (instantOrdirect) filter.instantOrdirect = instantOrdirect;

//     // Query the database with the filter
//     const employers = await Employerr.find(filter);

//     // Send the filtered employers as a response
//     res.status(200).json(employers);

//     if (employers.length == 0) {
//       res.status(404).send({ status: 404, message: "employee not found.", data: {} });
//     } else {
//       res.status(200).send({ status: 200, message: "Job Found successfully.", data: employers });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: 500, error: "Internal server error" })
//   }
// }


exports.loginWithPhone = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await Employerr.findOne({ mobile: mobile });
    if (!user) {
      return res.status(400).send({ msg: "not found" });
    }
    const userObj = {};
    userObj.otp = OTP.generateOTP();/* (4, {
      alphabets: false,
      upperCase: false,
      specialChar: false,
    } */;
    //   userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    //   userObj.accountVerification = false;
    const updated = await Employerr.findOneAndUpdate(
      { mobile: mobile },
      userObj,
      { new: true }
    );
    let obj = {
      id: updated._id,
      otp: updated.otp,
      mobile: updated.mobile,
    };
    res
      .status(200)
      .send({ status: 200, message: "logged in successfully", data: obj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updatebyManpoweridEmployer = async (req, res) => {
  try {
    const { mobile, orderId, manpowerId } = req.body;

    // Find the user/employer with the given mobile number
    const employer = await User.findOne({ mobile: mobile });

    if (!employer) {
      return res.status(404).json({ error: "User/Employer not found with the given mobile number." });
    }

    // Find the specific post in the obj array with the given orderId
    const post = employer.obj.find((post) => post.orderId === orderId);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (!post.manpower || !Array.isArray(post.manpower)) {
      post.manpower = []; // Initialize manpower as an empty array if it doesn't exist
    }

    // Check if the post is already assigned to the provided manpower
    if (post.manpower.includes(manpowerId)) {
      return res.status(400).json({ error: "You have already applied for this post." });
    }

    // Add the manpowerId to the array for the post
    post.manpower.push(manpowerId)
    console.log(post);
    // Find the index of the post in the obj array and update it with the updated post
    const postIndex = employer.obj.findIndex((post) => post.orderId === orderId);
    employer.obj[postIndex] = post;

    // Save the changes to the employer
    await employer.save();

    res.status(200).json({ message: "Successfully applied for the post.", post: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};






//////////////this api for manpower//////////////////

exports.verifyOtpByManpower = async (req, res) => {
  const manpowerId = req.params.manpowerid;
  const { otp } = req.body;

  try {
    // Find the order by ID
    const Manpower = await Manpowerr.findById(manpowerId);
    if (!Manpower) {
      return res.status(404).json({ message: "Manpower not found." });
    }

    // Compare the provided OTP with the stored OTP
    if (otp === Manpower.otpSendToManpowerr) {
      // OTP is correct, mark the order as delivered and update deliveredAt timestamp
      Manpower.otpSendToManpowerrVerified = "true";
      await Manpower.save();

      return res.status(200).json({ message: "OTP verified. Manpower verified successfully." });
    } else {
      return res.status(401).json({ message: "Invalid OTP , Manpower verified failed." });
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return res.status(500).json({ message: "An error occurred while verifying OTP." });
  }
};




