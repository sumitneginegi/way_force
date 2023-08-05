const Employerr = require("../models/employerModel");
const Manpowerr = require("../models/ManPowerModel");
const OTP = require("../config/OTP-Generate");
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');

const dbConnect = require("../config/DBConnect");
// dotenv.config();
dbConnect()

const twilio = require("twilio");
// var newOTP = require("otp-generators");

const reffralCode = async () => {
  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let OTP = "";
  for (let i = 0; i < 9; i++) {
    OTP += digits[Math.floor(Math.random() * 36)];
  }
  return OTP;
}

const accountSid = "AC0f17e37b275ea67e2e66d289b3a0ef84";
const authToken = "b84ef9419317143ffbff15233a713770";
const twilioPhoneNumber = "+14708354405";
const client = twilio(accountSid, authToken);

exports.registrationEmployer = async (req, res) => {
  try {

    const { mobile } = req.body;

    // res.status(200).json({ message: "OTP sent successfully" });

    var user = await User.findOne({ mobile: mobile, userType: "employer" })

    if (!user) {

      const otp = Math.floor(1000 + Math.random() * 9000);
    
      // Create and send the SMS with the OTP
      await client.messages.create({
        to: mobile,
        from: twilioPhoneNumber,
        body: `Your OTP is: ${otp}`,
      });

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
    const { phoneNumber } = req.body

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
      orderId: orderId,
      employerName:req.body.employerName
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Push the new document into the documents array
    user.obj.push(data);

    // Save the updated user document
    await user.save();

    res.status(200).send({data:user})
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
      orderId: orderId,
      employerName:req.body.employerName
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

    res.status(200).send({data:users})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.viewInShort = async (req, res) => {
  try {

    const instantOrdirectValue = req.query.instantOrdirect;
    // Aggregate pipeline to extract desired fields from the 'obj' array
    const aggregationPipeline = [
      { $unwind: "$obj" },
      // Match documents with userType: "employer" and obj.instantOrdirect: "instant"
      { $match: { userType: "employer", "obj.instantOrdirect": instantOrdirectValue } },
 
      {
        $project: {
          job_desc: "$obj.job_desc",
          employerName: "$obj.employerName",
          siteLocation: "$obj.siteLocation",
          no_Of_opening: "$obj.no_Of_opening",
          fullTime: "$obj.fullTime",
          maxiSalary: "$obj.maxSalary",
          miniSalary: "$obj.miniSalary",
          instantOrdirect: "$obj.instantOrdirect",
          orderId:"$obj.orderId",
        }
      }
    ];
    // Execute the aggregation pipeline
    const result = await User.aggregate(aggregationPipeline).exec();
    res.status(200).send({ data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



exports.ViewJobInDdetails = async (req, res) => {
  try {

    const instantOrdirectValue = req.query.instantOrdirect;
    const orderId = req.query.orderId
    // Aggregate pipeline to extract desired fields from the 'obj' array
    const aggregationPipeline = [
      { $unwind: "$obj" },
      // Match documents with userType: "employer" and obj.instantOrdirect: "instant"
      { $match: { userType: "employer", "obj.instantOrdirect": instantOrdirectValue,"obj.orderId": orderId } },
      // Match documents with userType: "employer"
      // Project only the desired fields from each job object
      {
        $project: {
          job_desc: "$obj.job_desc",
          employerName: "$obj.employerName",
          siteLocation: "$obj.siteLocation",
          no_Of_opening: "$obj.no_Of_opening",
          fullTime: "$obj.fullTime",
          maxiSalary: "$obj.maxSalary",
          miniSalary: "$obj.miniSalary",
          workingDays: "$obj.workingDays",
          workingHours: "$obj.workingHours",
          date: "$obj.date",
          skills: "$obj.skills",
          instantOrdirect: "$obj.instantOrdirect",
          orderId:"$obj.orderId",
          mobile: 1,
        }
      }
    ]
    // Execute the aggregation pipeline
    const result = await User.aggregate(aggregationPipeline).exec();
    res.status(200).send({data:result})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}



exports.viewInShortOfInstantLead = async (req, res) => {
  try {
    // Aggregate pipeline to extract desired fields from the 'obj' array
    const aggregationPipeline = [
      // Match documents with userType: "employer"
      { $match: { userType: "employer", "obj.instantOrdirect": "instant" } },
      // Unwind the 'obj' array to get individual job objects
      { $unwind: "$obj" },
      // Project only the desired fields from each job object
      {
        $project: {
          job_desc: "$obj.job_desc",
          employerName: "$obj.employerName",
          siteLocation: "$obj.siteLocation",
          fullTime: "$obj.fullTime",
          maxiSalary: "$obj.maxSalary",
          miniSalary: "$obj.miniSalary",
          instantOrdirect: "$obj.instantOrdirect"
        }
      }
    ];
    // Execute the aggregation pipeline
    const result = await User.aggregate(aggregationPipeline).exec();
    res.status(200).send({data:result})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



exports.getAllEmployer = async (req, res) => {
  try {
    const employers = await User.find({}, '_id mobile otp obj createdAt updatedAt');

    if (employers.length === 0) {
      return res.status(404).json({ error: "No employer data found." });
    }

    res.status(200).json({ success: true, data: employers });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
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
}



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
}



exports.updatebyManpoweridEmployer = async (req, res) => {
  try {
    const { /*mobile,*/ orderId, manpowerId } = req.body
  
    const employer = await User.findOne({
      "obj.orderId": orderId,
    });

    if (!employer) {
      return res.status(404).json({ error: "Employer not found with the given orderId." });
    }
    // const employer = await User.findOne({
    //   mobile: mobile,
    // });

    // if (!employer) {
    //   return res.status(404).json({ error: "User/Employer not found with the given mobile number." })
    // }

    // Find the specific post in the obj array with the given orderId
    const post = employer.obj.find((post) => post.orderId === orderId)
    
    if (!post) {
      return res.status(404).json({ error: "Post not found." })
    }

    if (!post.manpower || !Array.isArray(post.manpower)) {
      post.manpower = [] // Initialize manpower as an empty array if it doesn't exist
    }

    // Check if the post is already assigned to the provided manpower
    if (post.manpower.includes(manpowerId)) {
      return res.status(400).json({ error: "You have already applied for this post." })
    }
    // const otp = OTP.generateOTP()
    // Add the manpowerId to the array for the post
    // post.manpower.manpowerId = manpowerId
  
    post.manpower.push(manpowerId)
    // Generate OTP
    
// console.log(post);
    // Save the changes to the employer
    await employer.save()

      // Find the index of the post in the obj array and update it with the updated post
  const postIndex = employer.obj.findIndex((post) => post.orderId === orderId)
  console.log(postIndex)
  employer.obj[postIndex] = post

  // Save the changes to the employer again to update the obj array
  await employer.save();


    res.status(200).json({ message: "Successfully applied for the post.",post:employer})
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" })
  }
}



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



// Function to generate an OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}



exports.generateAndSaveOTP = async (req, res) => {
  try {
    const { orderId, manpowerId } = req.body;

    // Find the employer
    const employer = await User.findOne({ "obj.orderId": orderId });
    if (!employer) {
      return res.status(404).json({ error: "Employer not found with the given orderId." });
    }

    // Find the manpower
    const manpower = await User.findById(manpowerId)
    if (!manpower) {
      return res.status(404).json({ error: "Manpower not found." })
    }

    // Check if the post exists in the employer's obj array
    const postIndex = employer.obj.findIndex((post) => post.orderId === orderId);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found." });
    }


    if (!postIndex.manpower || !Array.isArray(postIndex.manpower)) {
      postIndex.manpower = [] // Initialize manpower as an empty array if it doesn't exist
    }
    // Check if the manpower has applied for the post with the given orderId
    const post = employer.obj[postIndex];
    if (!post.manpower || !post.manpower.includes(manpowerId)) {
      return res.status(400).json({ error: "Manpower has not applied for this post." });
    }

    // Generate the OTP
    const otp = generateOTP();

    // Save the OTP in employer's document
    employer.obj[postIndex].otpSendToEmployer = otp;
    employer.markModified("obj"); // Mark 'obj' field as modified
    await employer.save();

    // Save the OTP in manpower's document
    // manpower.otpSendToManpowerr = otp;
    // await manpower.save();

    manpower.manpowerObj = {
      employerName: employer.obj[postIndex].employerName,
      orderId: employer.obj[postIndex].orderId,
      otpSendToManpower: otp
    };
    // manpower.manpowerObj.push(manpowerObj);
    await manpower.save();

    // Here you can trigger the sending of OTP to both manpower and employer if needed.
    // For example, you can send OTP via SMS or email to their mobile numbers or email addresses.

    res.status(200).json({ message: "OTP generated and saved successfully.", man: employer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}



exports.verifyOTPByManpower = async (req, res) => {
  try {
    const { orderId, manpowerId, otp } = req.body;

    // Find the employer
    const employer = await User.findOne({ "obj.orderId": orderId });
    if (!employer) {
      return res.status(404).json({ error: "Employer not found with the given orderId." });
    }

    // Find the manpower
    // const manpower = await User.findById(manpowerId)
    // if (!manpower) {
    //   return res.status(404).json({ error: "Manpower not found." })
    // }

    // Check if the post exists in the employer's obj array
    const postIndex = employer.obj.findIndex((post) => post.orderId === orderId);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (!postIndex.manpower || !Array.isArray(postIndex.manpower)) {
      postIndex.manpower = [] // Initialize manpower as an empty array if it doesn't exist
    }
    // Check if the manpower has applied for the post with the given orderId
    const post = employer.obj[postIndex];
    // if (!post.manpower || !post.manpower.includes(manpowerId)) {
    //   return res.status(400).json({ error: "Manpower has not applied for this post." });
    // }

    // Check if the OTP provided by the manpower matches the OTP saved in the database
    if (otp !== post.otpSendToEmployer) {
      return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    // If OTP is verified, you can proceed with your further logic here.

    res.status(200).json({ message: "OTP verified successfully.", post: post })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


