var admin = require("firebase-admin");
var serviceAccount = require("../firebasee.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const Employerr = require("../models/employerModel");
const Manpowerr = require("../models/ManPowerModel");
const OTP = require("../config/OTP-Generate");
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const Notification = require('../models/notification');

const io = require('socket.io')(); // Import the Socket.io instance (make sure it's the same instance as in your main server file)


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



exports.registrationthroughAdmin = async (req, res) => {
  try {

    const data = {
      employerName: req.body.employerName,
      active: req.body.active,
      gender: req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      createdAt: req.body.createdAt,
      state: req.body.state,
      city: req.body.city,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      pinCode: req.body.pinCode,
      aadharCard: req.body.aadharCard, // Updated field
      panCard: req.body.panCard, // Updated field,
      siteLocation: req.body.siteLocation,
    }

    var user = await User.findOne({ mobile: data.mobile, userType: "employer" })

    if (!user) {
      req.body.userType = "employer"


      const userCreate = await User.create({
        data,
        wallet: 100,
        ...req.body
      })

      let obj = {
        id: userCreate._id,
        mobile: userCreate.mobile,
        employerName: userCreate.employerName,
        active: userCreate.active,
        gender: userCreate.gender,
        email: userCreate.email,
        mobile: userCreate.mobile,
        createdAt: userCreate.createdAt,
        state: userCreate.state,
        city: userCreate.city,
        GST_Number: userCreate.GST_Number,
        registration_Number: userCreate.registration_Number,
        pinCode: userCreate.pinCode,
        aadharCard: userCreate.aadharCard,
        panCard: userCreate.panCard,
        siteLocation: userCreate.siteLocation,
      }

      res.status(201).send({
        status: 200,
        message: "Registered successfully ",
        data: obj
      })
    } else {
      return res.json({ status: 409, message: "Already Exit" });
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" });
  }
}



exports.registrationEmployer = async (req, res) => {
  try {

    const { mobile, otp } = req.body;

    // res.status(200).json({ message: "OTP sent successfully" });

    var user = await User.findOne({ mobile: mobile, userType: "employer" })

    if (!user) {

      // const otp = Math.floor(1000 + Math.random() * 9000);

      // Create and send the SMS with the OTP
      // await client.messages.create({
      //   to: mobile,
      //   from: twilioPhoneNumber,
      //   body: `Your OTP is: ${otp}`,
      // });

      // req.body.otp = OTP.generateOTP()
      // req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000)
      // req.body.accountVerification = false
      req.body.userType = "employer",
        req.body.wallet = 100;

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

      res.status(201).send({
        status: 200,
        message: "Registered successfully ",
        data: obj
      });
    } else {
      return res.json({ status: 409, message: "Already Exit" });
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

    const otp = Math.floor(1000 + Math.random() * 9000)

    res.status(200).json({ message: "OTP sent successfully", phoneNumber: phoneNumber, otp: otp });
  }

  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}




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
}



exports.updateEmployer = async (req, res) => {
  const employerId = req.params.id;

  try {
    const updatedData = {
      employerName: req.body.employerName,
      active: req.body.active,
      gender: req.body.gender,
      email: req.body.email,
      createdAt: req.body.createdAt,
      state: req.body.state,
      city: req.body.city,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      aadharCard: req.body.aadharCard, // Updated field
      panCard: req.body.panCard, // Updated field
    };

    const updatedEmployer = await User.findByIdAndUpdate(employerId, updatedData, { new: true });

    if (!updatedEmployer) {
      return res.status(404).json({ msg: 'Employer not found' });
    }

    return res.status(200).json({ updatedEmployer });
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'An error occurred', error: err.message });
  }
}



exports.fillEmployerDetails = async (req, res) => {
  const employerId = req.params.id;
  console.log("hi");
  try {
    const updatedData = {
      employerName: req.body.employerName,
      active: req.body.active,
      gender: req.body.gender,
      email: req.body.email,
      mobile: req.body.mobile,
      createdAt: req.body.createdAt,
      state: req.body.state,
      city: req.body.city,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      pinCode: req.body.pinCode,
      aadharCard: req.body.aadharCard, // Updated field
      panCard: req.body.panCard, // Updated field,
      siteLocation: req.body.siteLocation,
    };

    const updatedEmployer = await User.findByIdAndUpdate(employerId, updatedData, { new: true });

    if (!updatedEmployer) {
      return res.status(404).json({ msg: 'Employer not found' });
    }

    return res.status(200).json({ updatedEmployer });
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'An error occurred', error: err.message });
  }
}


exports.detailDirectEmployer = async (req, res) => {
  try {
    let orderId = await reffralCode()
    const data = {
      // mobile: req.body.mobile,
      job_desc: req.body.job_desc,
      city: req.body.city,
      skills: req.body.skills,
      state: req.body.state,
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
      employerName: req.body.employerName,

      pinCode: req.body.pinCode,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      lati: req.body.lati,
      longi: req.body.longi,
      startTime: req.body.startTime,
      endTime: req.body.endTime

    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Push the new document into the documents array
    user.obj.push(data);

    // Save the updated user document
    await user.save();

    res.status(200).send({ data: user })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}



exports.detailInstantEmployer = async (req, res) => {
  try {
    let orderId = await reffralCode()

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Note: Month is 0-indexed, so adding 1
    const day = today.getDate();

    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate);

    const data = {
      // mobile: req.body.mobile,
      job_desc: req.body.job_desc,
      siteLocation: req.body.siteLocation,
      category: req.body.category,
      explainYourWork: req.body.explainYourWork,
      date: formattedDate,
      lati: req.body.lati,
      longi: req.body.longi,
      instantOrdirect: "instant",
      orderId: orderId,
      employerName: req.body.employerName,
      startTime: req.body.startTime,
      endTime: req.body.endTime
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    // Check if the user's wallet balance is sufficient to post a job
    const walletBalance = user.wallet || 0; // Assuming walletBalance is a property of the user object
    const jobPostingPrice = 10; // Define the price for posting a job here

    if (walletBalance < jobPostingPrice) {
      return res.status(400).json({ error: "You do not have sufficient balance to post a job. Please add funds to your wallet." });
    }

    // Deduct the job posting price from the wallet balance
    user.wallet-= jobPostingPrice;

    // Push the new document into the documents array
    user.obj.push(data);

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "Details filled successfully", data: user });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went wrong" });
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

    res.status(200).send({ data: users })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}




exports.getPostByEmployerIdAndOrderId = async (req, res) => {
  try {
    const employerId = req.query.employerId; // Assuming you're passing employerId as a URL parameter
    const orderId = req.query.orderId; // Assuming you're passing orderId as a URL parameter

    const user = await User.findOne({
      _id: employerId,
      "obj.orderId": orderId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found or orderId not found." });
    }

    const post = user.obj.find((item) => item.orderId === orderId);

    if (!post) {
      return res.status(404).json({ error: "Post not found with the specified orderId." });
    }

    return res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



exports.getCountOfPostsByEmployerIdAndInstantOrDirect = async (req, res) => {
  try {
    const employerId = req.query.employerId; // Assuming you're passing employerId as a query parameter
    const instantOrdirectValue = req.query.instantOrdirect; // Assuming you're passing instantOrdirect as a query parameter

    const user = await User.findOne({
      _id: employerId,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const posts = user.obj.filter((item) => item.instantOrdirect === instantOrdirectValue);

    return res.status(200).json({ post: posts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




exports.viewInShort = async (req, res) => {
  try {
    const instantOrdirectValue = req.query.instantOrdirect;
    const employmentTypeValue = req.query.employmentType; // Added line to get employmentType query parameter

    // Aggregate pipeline to extract desired fields from the 'obj' array
    const aggregationPipeline = [
      { $unwind: "$obj" },
      // Match documents with userType: "employer", obj.instantOrdirect: instantOrdirectValue, and obj.employmentType: employmentTypeValue
      {
        $match: {
          userType: "employer",
          "obj.instantOrdirect": instantOrdirectValue,
          "obj.employmentType": employmentTypeValue
        }
      },
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
          orderId: "$obj.orderId",
          employmentType: "$obj.employmentType"

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
}



exports.ViewJobInDdetails = async (req, res) => {
  try {

    const instantOrdirectValue = req.query.instantOrdirect;
    const orderId = req.query.orderId
    // Aggregate pipeline to extract desired fields from the 'obj' array
    const aggregationPipeline = [
      { $unwind: "$obj" },
      // Match documents with userType: "employer" and obj.instantOrdirect: "instant"
      { $match: { userType: "employer", "obj.instantOrdirect": instantOrdirectValue, "obj.orderId": orderId } },
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
          orderId: "$obj.orderId",
          mobile: 1,
          startTime: "$obj.startTime",
          endTime: "$obj.endTime"
        }
      }
    ]
    // Execute the aggregation pipeline
    const result = await User.aggregate(aggregationPipeline).exec();
    res.status(200).send({ data: result })
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
    res.status(200).send({ data: result })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



exports.getAllEmployer = async (req, res) => {
  try {
    const employers = await User.find({ userType: "employer" })
    console.log(employers)

    if (employers.length === 0) {
      return res.status(404).json({ error: "No employer data found." });
    }

    res.status(200).json({ success: true, data: employers });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}



exports.getAllEmployerById = async (req, res) => {
  try {
    const Employer = await User.findOne({ _id: req.params.id })
    if (!Employer) {
      return res.status(400).json({ error: "Employer data not provided" });
    }
    res.status(201).json({ success: true, data: Employer })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


// Assuming you have already required the necessary modules and defined the User model

exports.getPostsByEmployerId = async (req, res) => {
  try {
    const employerId = req.params.id;

    // Find the employer by their ID
    const employer = await User.findOne({ _id: employerId });

    if (!employer) {
      return res.status(400).json({ error: "Employer data not found" });
    }

    // Extract the posts from the 'obj' array
    const posts = employer.obj;

    // Respond with the extracted posts
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}




exports.sendotpEmployerLogin = async (req, res) => {
  console.log("hi");
  try {
    const { phoneNumber } = req.body

    const otp = Math.floor(1000 + Math.random() * 9000)

    const user = await User.findOneAndUpdate({ mobile: phoneNumber, userType: "employer" }, { otp: otp }, { new: true })
    if (!user) {
      return res.status(400).json({ message: "phone number not exist" });
    }

    return res.status(200).json({ message: "OTP sent successfully", otp: user.otp });
  }

  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

exports.loginEmployer = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ error: "Mobile number required" });
    }
    const test = await User.findOne({ mobile: mobile, userType: "employer", });

    if (test) {
      const employer = await User.findOne({ mobile: mobile, userType: "employer", otp: otp });
      if (!employer) {

        return res.status(404).json({ error: "Otp is incorrect" });
      }
    }
    else {
      return res.status(404).json({ error: "employer not found" });
    }

    // employer.otp = otp
    // employer.save()

    const token = jwt.sign({ employerId: test._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        otp,
        employer: test,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
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

    res.status(200).json({ message: "Successfully applied for the post.", post: employer.obj[postIndex] })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" })
  }
}



exports.updatebyAgentidEmployer = async (req, res) => {
  try {
    const { /*mobile,*/ orderId, agentId } = req.body

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

    if (!post.agent || !Array.isArray(post.agent)) {
      post.agent = [] // Initialize manpower as an empty array if it doesn't exist
    }

    // Check if the post is already assigned to the provided manpower
    if (post.agent.includes(agentId)) {
      return res.status(400).json({ error: "You have already applied for this post." })
    }
    // const otp = OTP.generateOTP()
    // Add the manpowerId to the array for the post
    // post.manpower.manpowerId = manpowerId

    post.agent.push(agentId)
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

    res.status(200).json({ message: "Successfully applied for the post.", post: employer })
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
}



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
    // const post = employer.obj[postIndex];
    // if (!post.manpower || !post.manpower.includes(manpowerId)) {
    //   return res.status(400).json({ error: "Manpower has not applied for this post." });
    // }

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


exports.scheduled_Jobs = async (req, res) => {
  try {
    const userType = req.query.userType;

    // Find employers based on userType
    const employers = await User.find({ userType });

    // Filter and collect scheduled jobs with future dates
    const scheduledJobs = [];
    const currentDate = new Date();

    employers.forEach(employer => {
      employer.obj.forEach(job => {
        const jobDate = new Date(job.date);
        if (jobDate > currentDate) {
          scheduledJobs.push(job);
        }
      });
    });

    if (scheduledJobs.length === 0) {
      return res.json({ message: "No posts are scheduled ahead of the current date." });
    }

    res.status(200).json({ message: "success", scheduledJobs: scheduledJobs })

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
}



exports.upadtePostByStatusOfCompletion = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { startTime, endTime, statusOfCompletion } = req.body;

    // Find the employer based on userType and update the post
    const updatedUser = await User.findOneAndUpdate(
      { userType: 'employer', 'obj.orderId': orderId },
      {
        $set: {
          'obj.$.startTime': startTime,
          'obj.$.endTime': endTime,
          'obj.$.statusOfCompletion': statusOfCompletion,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Post not found for the given orderId' });
    }

    res.status(200).json({ msg: 'Post updated successfully', data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'An error occurred', error: error.message });
  }
}




exports.getCompletedPosts = async (req, res) => {
  try {

    const completed = req.query.completion;
    const completedPosts = await User.aggregate([
      { $unwind: '$obj' },
      { $match: { 'obj.statusOfCompletion': completed } },
      { $project: { _id: 0, 'obj': 1 } }
    ]);

    if (completedPosts.length === 0) {
      return res.status(404).json({ msg: 'No completed posts found' });
    }

    res.status(200).json({ msg: 'Completed posts retrieved successfully', data: completedPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'An error occurred', error: error.message });
  }
}



exports.getDataAccToEmployer_Manpower_Agent = async (req, res) => {
  try {
    const d = req.params.d
    console.log(d)

    if (d == "employer") {
      const data = await User.aggregate([
        {
          $match: {
            userType: 'employer',
          },
        },
        {
          $project: {
            employerName: { $arrayElemAt: ['$obj.employerName', 0] }, // Get the first employerName from the array
            createdAt: 1,
          },
        },
      ]);
      return res.status(200).json({ data });
    }

    if (d == "manpower") {
      const data = await User.aggregate([
        {
          $match: {
            userType: 'manpower',
          },
        },
        {
          $project: {
            manpowerName: 1,
            createdAt: 1,
          },
        },
      ]);
      return res.status(201).json({
        data: data,
      })
    }

    if (d == "agent") {
      const data = await User.aggregate([
        {
          $match: {
            userType: 'agent',
          },
        },
        {
          $project: {
            name: '$agentName',
            createdAt: 1,
          },
        },
      ]);
      return res.status(200).send({ data: data })
    }
    return res.status(400).json({ msg: 'Invalid (d)' });
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'An error occurred', error: err.message });
  }
}



exports.getDataOfAllEmployerInShort = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $match: {
          userType: 'employer',
        },
      },
      {
        $project: {
          employerName: 1,
          GST_Number: 1,
          aadharCard: 1,
          city: 1,
          email: 1,
          gender: 1,
          panCard: 1,
          registration_Number: 1,
          state: 1,
          createdAt: 1,

        },
      },
    ]);
    return res.status(200).json({ data });
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: 'An error occurred', error: err.message });
  }
}



exports.updateManpowerToken = async (req, res) => {
  try {
    const { newToken } = req.body;

    // Find the manpower by manpowerId
    const manpower = await User.findById({_id:req.params.manpowerId});
console.log(manpower);
    if (!manpower || manpower.userType !== "manpower") {
      return res.status(400).json({ message: "Invalid manpower ID" });
    }

    // Update the token field for the manpower
    manpower.token = newToken;

    // Save the updated manpower document
    await manpower.save();

    return res.status(200).json({ message: "Token updated successfully",data:manpower });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};




exports.findManpowerthroughRadius = async (req, res) => {
  try {
    const { employerId, orderId, radiusInKm , category } = req.body;

    // Find the employer by employerId
    const employer = await User.findById(employerId);
    // console.log(employer.employerName);

    if (!employer || employer.userType !== "employer") {
      return res.status(400).json({ message: "Invalid employer ID" });
    }

    // Find the post within the employer's obj array by orderId
    const post = employer.obj.find((post) => post.orderId == orderId);
console.log(post);
    if (!post) {
      return res.status(400).json({ message: "orderId not found" });
    }

    // Extract post details
    const {
      job_desc,
      siteLocation,
      explainYourWork,
      date
    } = post;
  
    // Extract the post's latitude and longitude
    const { lati, longi } = post;

    // Find manpower within the specified radius
    const manpowerWithinRadius = await User.find({
      "serviceLocation.lati": { $exists: true }, // Ensure serviceLocation exists
      "serviceLocation.longi": { $exists: true }, // Ensure serviceLocation exists
      "category": category
    }).lean();

    // console.log(manpowerWithinRadius);


    const filteredManpower = manpowerWithinRadius.filter((manpower) => {
      const distance = getDistanceFromLatLonInKm(
        lati,
        longi,
        manpower.serviceLocation.lati,
        manpower.serviceLocation.longi
      );
      console.log(distance);
      return distance <= radiusInKm; // Filter by radius
    });

    console.log(filteredManpower);
    // Send notifications for each post
    for (const manpower of filteredManpower) {
      const message = {
        data: {
          userType: manpower.userType, // Custom data
          _id: manpower._id ? manpower._id.toString() : "",
        },
        notification: {
          title: `Lead for ${category}`, // Corrected title property
          body: `Description: ${job_desc}
            Location: ${siteLocation}
            Category: ${category}
            Explain Your Work: ${explainYourWork}
            Date: ${date}
          `, // Include post details in the body
        },
        token: manpower.token,
      };

      try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }

    io.emit('manpowerData', filteredManpower);
    return res.json({ data: filteredManpower.length, manpower: filteredManpower });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// Function to calculate distance between two coordinates using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}


// Utility function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}



exports.YourProfileUpdateEmployer = async (req, res) => {
  try {
    let ProfileUpdate = req.files["profile"];
    req.body.pro = ProfileUpdate[0].path;
    console.log(req.body.pro)
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          profile: req.body.pro,
        },
      },
      { new: true }
    );
    // user.save();
    return res
      .status(200)
      .json({ msg: "Your profile updated successfully", user: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ status: 500, message: "Server error" + error.message });
  }
}


// Define the PUT API route to update lati and longi for a specific post
exports.updateLatAndLong = async (req, res) => {
  const orderId = req.params.orderId;
  const { lati, longi } = req.body; // Assuming you send lati and longi in the request body

  try {
    // Find the post by _id and update the lati and longi fields inside obj array
    const updatedUser = await User.findOneAndUpdate(
      {
        userType: 'employer',
        'obj.orderId': orderId, // Find the user with the specific post inside obj array
      },
      {
        $set: {
          'obj.$.lati': lati,
          'obj.$.longi': longi,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


exports.updateWalletForEmployers = async (req, res) => {
  try {
    // Define the condition to find employers (adjust as needed)
    const condition = { userType: "employer" };

    // Define the update operation (adding the wallet field)
    const update = { $set: { wallet: 0 } }; // Set the initial wallet balance (0 in this example)

    // Use updateMany to update documents that match the condition
    const result = await User.updateMany(condition, update);

    return res.status(200).json({ message: "Wallet field added to employers", updatedCount: result.nModified });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}