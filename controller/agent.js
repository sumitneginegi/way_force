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
const authToken = "8c138751182cdc12e0e3886fed46581f";
const twilioPhoneNumber = "+14708354405";
const client = twilio(accountSid, authToken);


exports.sendotpAgent = async (req, res) => {
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



exports.registrationAgent = async (req, res) => {
  try {
    const { mobile ,otp } = req.body

    // res.status(200).json({ message: "OTP sent successfully" });

    var user = await User.findOne({ mobile: mobile, userType: "agent" })
    
    if (!user) {
      // const otp = Math.floor(1000 + Math.random() * 9000)
    
      // Create and send the SMS with the OTP
      // await client.messages.create({
      //   to: mobile,
      //   from: twilioPhoneNumber,
      //   body: `Your OTP is: ${otp}`,
      // });
      
      // req.body.otp = OTP.generateOTP()
      // req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000)
      // req.body.accountVerification = false
      req.body.userType = "agent",
      req.body.wallet = 100;

      // let referalUser = null;

      const userCreate = await User.create({
        mobile,
        otp,
        // referalCodeUnique,
        ...req.body
      })
      console.log(userCreate);
      let obj = {
        id: userCreate._id,
        otp: userCreate.otp,
        mobile: userCreate.mobile,
      }

      res.status(200).send({
        status: 200,
        message: "Registered successfully ",
        data: obj
      })
    } else {
      return res.status(409).send({ status: 409, msg: "Already Exit" })
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" });
  }
}



exports.registrationthroughAdmin = async (req, res) => {
  try {

    const data = {
      agentName: req.body.agentName,
      agentAddress:req.body.agentAddress,
      agentServiceLocation:req.body.agentServiceLocation,
      // agentBusinessName:req.body.agentBusinessName,
      agentStrength:req.body.agentStrength,
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
      // aadharCard: req.body.aadharCard, // Updated field
      // panCard: req.body.panCard, // Updated field,
      siteLocation: req.body.siteLocation,

    }

    var user = await User.findOne({ mobile: data.mobile, userType: "agent" })

    if (!user) {
      req.body.userType = "agent"


      const userCreate = await User.create({
        data,
        wallet: 100,
        ...req.body
      })

      let obj = {
        id: userCreate._id,
        mobile: userCreate.mobile,
        agentName: userCreate.agentName,
        agentAddress: userCreate.agentAddress,
        agentServiceLocation:userCreate.agentServiceLocation,
        agentStrength:userCreate.agentStrength,
        active: userCreate.active,
        gender: userCreate.gender,
        email: userCreate.email,
        createdAt: userCreate.createdAt,
        state: userCreate.state,
        city: userCreate.city,
        GST_Number: userCreate.GST_Number,
        registration_Number: userCreate.registration_Number,
        pinCode: userCreate.pinCode,
        // aadharCard: userCreate.aadharCard,
        // panCard: userCreate.panCard,
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


exports.verifyOtpAgent = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otpFromDb = user.otp
    console.log(otp);
    if (!otpFromDb || otpFromDb !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    // user.otp = null;
    user.mobileVerified = true
    await user.save();
    return res.status(200).json({ message: "verified successfully" });
  } catch (err) {
    console.error(err)
    return createResponse(res, 500, "Internal server error");
  }
}



exports.detailDirectAgent = async (req, res) => {
  try {
    const id = req.params.id;
    let adhaar = req.files["aadhar"];
      let pan = req.files["pan"];

      req.body.uploadaadhar = adhaar[0].path;
      req.body.uploadPanCard = pan[0].path;
    const {
        agentName,
        agentAddress,
        agentServiceLocation,
        agentBusinessName,
        GST_Number,
        registration_Number,
        agentStrength,
        aadharCard,
        panCard,
        category,
        gender
    } = req.body;

    // Check if the user exists
    const Agent = await User.findById(id);
    if (!Agent) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's details
    Agent.agentName = agentName;
    Agent.agentAddress = agentAddress;
    Agent.agentServiceLocation = agentServiceLocation;
    Agent.agentBusinessName = agentBusinessName;
    Agent.GST_Number = GST_Number;
    Agent.registration_Number = registration_Number;
    Agent.agentStrength = agentStrength;
    Agent.aadharCard = aadharCard;
    Agent.panCard = panCard; 
    Agent.category =  category,
    Agent.gender =  gender,
    Agent.uploadaadhar = req.body.uploadaadhar,
    Agent.uploadPanCard = req.body.uploadPanCard,

    await Agent.save();

    res
      .status(200)
      .json({ message: "Details filled successfully", data: Agent });
  
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


exports.updateFileAndDocumentVendor = async (req, res) => {
    try {
      // console.log("hi")
      let front = req.files["frontImage"];
      let back = req.files["backImage"];
      let pic = req.files["pic"];
      let panCard = req.files["panCard"];
      req.body.frontSide = front[0].path;
      req.body.backSide = back[0].path;
      req.body.uploadSelfie = pic[0].path;
      req.body.uploadPanCard = panCard[0].path;
  
  
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            frontSide: req.body.frontSide,
            backSide: req.body.backSide,
            uploadSelfie: req.body.uploadSelfie,
            uploadPanCard: req.body.uploadPanCard,
            pancard: req.body.pancardNumber,
            aadharCard: req.body.aadharCardNumber,
            document: req.body.document,
          },
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ msg: "profile updated successfully", user: user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ status: 500, message: "Server error" + error.message });
    }
  };
    

  
exports.listOfAllLeadByEmployer = async (req, res) => {
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
      date: formattedDate,
      // manpowerId: req.body.manpowerId,
      mobileVerified: req.body.mobileVerified,
      state: req.body.state,
      pinCode: req.body.pinCode,
      GST_Number: req.body.GST_Number,
      registration_Number: req.body.registration_Number,
      lati: req.body.lati,
      longi: req.body.longi,
      instantOrdirect: "direct",
      orderId: orderId,
      employerName: req.body.employerName,
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

    res
      .status(200)
      .json({ message: "Details filled successfully", data: user });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong" });
  }
}



exports.getAllAgent = async (req, res) => {
  try {
    const agentt = await User.find({ userType: "agent"})
    console.log(agentt)

    if (agentt.length === 0) {
      return res.status(404).json({ error: "No agent data found." });
    }

    res.status(200).json({ success: true, data: agentt });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}



// exports.viewInShort = async (req, res) => {
//   try {

//     const instantOrdirectValue = req.query.instantOrdirect;
//     // Aggregate pipeline to extract desired fields from the 'obj' array
//     const aggregationPipeline = [
//       { $unwind: "$obj" },
//       // Match documents with userType: "employer" and obj.instantOrdirect: "instant"
//       { $match: { userType: "employer", "obj.instantOrdirect": instantOrdirectValue } },

//       {
//         $project: {
//           job_desc: "$obj.job_desc",
//           employerName: "$obj.employerName",
//           siteLocation: "$obj.siteLocation",
//           no_Of_opening: "$obj.no_Of_opening",
//           fullTime: "$obj.fullTime",
//           maxiSalary: "$obj.maxSalary",
//           miniSalary: "$obj.miniSalary",
//           instantOrdirect: "$obj.instantOrdirect",
//           orderId: "$obj.orderId",
//         }
//       }
//     ];
//     // Execute the aggregation pipeline
//     const result = await User.aggregate(aggregationPipeline).exec();
//     res.status(200).send({ data: result });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }



// exports.ViewJobInDdetails = async (req, res) => {
//   try {

//     const instantOrdirectValue = req.query.instantOrdirect;
//     const orderId = req.query.orderId
//     // Aggregate pipeline to extract desired fields from the 'obj' array
//     const aggregationPipeline = [
//       { $unwind: "$obj" },
//       // Match documents with userType: "employer" and obj.instantOrdirect: "instant"
//       { $match: { userType: "employer", "obj.instantOrdirect": instantOrdirectValue, "obj.orderId": orderId } },
//       // Match documents with userType: "employer"
//       // Project only the desired fields from each job object
//       {
//         $project: {
//           job_desc: "$obj.job_desc",
//           employerName: "$obj.employerName",
//           siteLocation: "$obj.siteLocation",
//           no_Of_opening: "$obj.no_Of_opening",
//           fullTime: "$obj.fullTime",
//           maxiSalary: "$obj.maxSalary",
//           miniSalary: "$obj.miniSalary",
//           workingDays: "$obj.workingDays",
//           workingHours: "$obj.workingHours",
//           date: "$obj.date",
//           skills: "$obj.skills",
//           instantOrdirect: "$obj.instantOrdirect",
//           orderId: "$obj.orderId",
//           mobile: 1,
//           startTime: "$obj.startTime",
//           endTime: "$obj.endTime"
//         }
//       }
//     ]
//     // Execute the aggregation pipeline
//     const result = await User.aggregate(aggregationPipeline).exec();
//     res.status(200).send({ data: result })
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// }



// exports.viewInShortOfInstantLead = async (req, res) => {
//   try {
//     // Aggregate pipeline to extract desired fields from the 'obj' array
//     const aggregationPipeline = [
//       // Match documents with userType: "employer"
//       { $match: { userType: "employer", "obj.instantOrdirect": "instant" } },
//       // Unwind the 'obj' array to get individual job objects
//       { $unwind: "$obj" },
//       // Project only the desired fields from each job object
//       {
//         $project: {
//           job_desc: "$obj.job_desc",
//           employerName: "$obj.employerName",
//           siteLocation: "$obj.siteLocation",
//           fullTime: "$obj.fullTime",
//           maxiSalary: "$obj.maxSalary",
//           miniSalary: "$obj.miniSalary",
//           instantOrdirect: "$obj.instantOrdirect"
//         }
//       }
//     ];
//     // Execute the aggregation pipeline
//     const result = await User.aggregate(aggregationPipeline).exec();
//     res.status(200).send({ data: result })
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
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
//     const Employer = await Employerr.find({ _id: req.params.id })
//     if (!Employer) {
//       return res.status(400).json({ error: "Employer data not provided" });
//     }
//     res.status(201).json({ success: true, data: Employer })
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }


exports.sendotpAgentLogin = async (req, res) => {
  console.log("hi");
  try {
    const { phoneNumber } = req.body

    const otp = Math.floor(1000 + Math.random() * 9000)

    const user = await User.findOneAndUpdate({ mobile: phoneNumber, userType: "agent" }, { otp: otp }, { new: true })
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



exports.loginAgent = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ error: "Mobile number required" });
    }
    const test = await User.findOne({ mobile: mobile, userType: "agent", });

    if (test) {
      const agent = await User.findOne({ mobile: mobile, userType: "agent", otp: otp });
      if (!agent) {

        return res.status(404).json({ error: "Otp is incorrect" });
      }
    }
    else {
      return res.status(404).json({ error: "agent not found" });
    }

    // employer.otp = otp
    // employer.save()

    const token = jwt.sign({ agentId: test._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        otp,
        agent: test,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}



// exports.loginAgent = async (req, res) => {
//     try {
//       const { mobile } = req.body;
//       const user = await User.findOne({ mobile: mobile, userType: "agent" })
//       if (!user) {
//         return res.status(400).send({ msg: "not found" });
//       }
//       const userObj = {};
//       userObj.otp = OTP.generateOTP();/* (4, {
//         alphabets: false,
//         upperCase: false,
//         specialChar: false,
//       } */;
//       //   userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
//       //   userObj.accountVerification = false;
//       const updated = await User.findOneAndUpdate(
//         { mobile: mobile },
//         userObj,
//         { new: true }
//       );
//       let obj = {
//         id: updated._id,
//         otp: updated.otp,
//         mobile: updated.mobile,
//       };
//       res
//         .status(200)
//         .send({ status: 200, message: "logged in successfully", data: obj });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server error" });
//     }
//   }


  exports.getAgentById = async (req, res) => {
    const { agentId } = req.params;
  
    try {
      // Check if a user with the given userId exists in the database
      const user = await User.findById(agentId).lean();
  
      if (!user) {
        return res.status(404).json({ message: "Agent not found" });
      }
  
      // Send a response with the user information
      return res.status(200).json({ message: "Agent retrieved successfully", data:user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error:err.message });
    }
  }


  exports.YourProfileUpdateAgent = async (req, res) => {
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

