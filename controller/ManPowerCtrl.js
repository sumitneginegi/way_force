const ManPower = require("../models/ManPowerModel")
const OTP = require("../config/OTP-Generate")
const Employerr = require("../models/employerModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const twilio = require("twilio");
// var newOTP = require("otp-generators");
const User = require("../models/user")
const mongoose = require("mongoose");


const accountSid = "AC0f17e37b275ea67e2e66d289b3a0ef84";
const authToken = "55fa82795d6e59230fd33ad418ed9891";
// const authToken ="4fd6915b4c0dadbc1deef2fec4a8f85";
const twilioPhoneNumber = "+14708354405";
const client = twilio(accountSid, authToken);



exports.registrationManpowerAdmin = async (req, res) => {
  try {

    const data = {
      manpowerName: req.body.manpowerName,
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
      serviceLocation: req.body.serviceLocation,
      landmark: req.body.landmark,
      block: req.body.block,
      education: req.body.education,
      skills: req.body.skills,
    }

    var user = await User.findOne({ mobile: data.mobile, userType: "manpower" })

    if (user) {
      return res.json({ status: 409, message: "Already Exit" });
    } else {
      req.body.userType = "manpower"


      const userCreate = await User.create({
        data,
        ...req.body
      })

      let obj = {
        id: userCreate._id,
        mobile: userCreate.mobile,
        manpowerName: userCreate.manpowerName,
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
        serviceLocation: userCreate.serviceLocation,
        landmark: userCreate.landmark,
        block: userCreate.block,
        education: userCreate.education,
        skills: userCreate.skills,
      }

      res.status(201).send({
        status: 200,
        message: "Registered successfully ",
        data: obj
      })
    }

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" });
  }
}


exports.registrationManpower = async (req, res) => {
  try {

    const { mobile, otp } = req.body;

    // res.status(200).json({ message: "OTP sent successfully" });

    var user = await User.findOne({ mobile: mobile, userType: "manpower" })

    if (!user) {

      // const otp = Math.floor(1000 + Math.random() * 9000);

      // // Create and send the SMS with the OTP
      // await client.messages.create({
      //   to: mobile,
      //   from: twilioPhoneNumber,
      //   body: `Your OTP is: ${otp}`,
      // });

      // req.body.otp = OTP.generateOTP()
      // req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000)
      // req.body.accountVerification = false
      req.body.userType = "manpower"

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
      return res.status(409).send({ status: 409, message: "Already Exit" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


exports.sendotpManpower = async (req, res) => {
  console.log("hi");
  try {
    const { phoneNumber } = req.body

    const otp = Math.floor(1000 + Math.random() * 9000)

    res.status(200).json({ message: "OTP sent successfully", phoneNumber: phoneNumber, otp: otp });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

exports.signupManpower = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ error: "Mobile number is required" });
    }

    const existingMobile = await ManPower.findOne({ mobile });
    if (existingMobile) {
      return res.status(409).json({ error: "Mobile number already in use" });
    }

    const otp = OTP.generateOTP();

    const newManPower = new ManPower({ mobile, otp });
    await newManPower.save();

    res.status(201).json({
      message: "Sign up successful",
      data: newManPower,
      otp: otp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ _id: req.params.id });
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
    return res.status(200).json({
      message: "verified successfully",
      data: user._id
    });
  } catch (err) {
    console.error(err);
    return createResponse(res, 500, "Internal server error");
  }
}


exports.detailSignup = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      manpowerName,
      address,
      education,
      age,
      gender,
      dob,
      language,
      bio,
      experience,
      minSalary,
      maxSalary,
      skills,
      city,
      state,
      jobType,
      serviceLocation,
      documents,
      email,
      siteLocation
    } = req.body;

    // Check if the user exists
    const manPower = await User.findById(id);
    if (!manPower) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's details
    manPower.manpowerName = manpowerName;
    manPower.address = address;
    manPower.education = education;
    manPower.age = age;
    manPower.gender = gender;
    manPower.dob = dob;
    manPower.language = language;
    manPower.bio = bio;
    manPower.experience = experience;
    manPower.miniSalary = minSalary;
    manPower.maxSalary = maxSalary;
    manPower.skills = skills;
    manPower.jobType = jobType;
    manPower.serviceLocation = serviceLocation;
    manPower.documents = documents;
    manPower.city = city;
    manPower.state = state;
    manPower.email = email;
    manPower.siteLocation = siteLocation
    // manPower.otp = OTP.generateOTP();

    await manPower.save();

    res
      .status(200)
      .json({ message: "Details filled successfully", data: manPower });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}


exports.workDetails = async (req, res) => {
  try {
    const manpowerId = req.params.id;
    const {
      bio,
      experience,
      minSalary,
      maxSalary,
      skills,
      jobType,
      serviceLocation,
      documents,
    } = req.body;

    // Check if manpower with the given ID exists
    const manpower = await User.findById(manpowerId);

    if (!manpower) {
      return res.status(404).json({ error: "Manpower not found" });
    }

    // Update the work details with the provided data
    if (bio) {
      manpower.bio = bio;
    }

    if (experience) {
      manpower.experience = experience;
    }

    if (minSalary) {
      manpower.minSalary = minSalary;
    }

    if (maxSalary) {
      manpower.maxSalary = maxSalary;
    }

    if (jobType) {
      manpower.jobType = jobType;
    }

    if (serviceLocation) {
      manpower.serviceLocation = serviceLocation;
    }

    // Update skills if provided
    if (skills && Array.isArray(skills) && skills.length > 0) {
      // Assuming there is a Skill model that contains skill details
      // Replace 'Skill' with your actual Skill model name
      const existingSkills = await Skill.find({
        _id: { $in: manpower.skills },
      });

      // Check if any of the provided skills are not already associated with the manpower
      const newSkills = skills.filter(
        (skill) => !existingSkills.some((s) => s._id.toString() === skill)
      );

      // If there are new skills, add them to the manpower's skills array
      if (newSkills.length > 0) {
        manpower.skills.push(...newSkills);
      }
    }

    // Update documents if provided
    if (documents && Array.isArray(documents) && documents.length > 0) {
      // Assuming there is a Document model that contains document details
      // Replace 'Document' with your actual Document model name
      const existingDocuments = await Document.find({
        _id: { $in: manpower.documents },
      });

      // Check if any of the provided documents are not already associated with the manpower
      const newDocuments = documents.filter(
        (doc) => !existingDocuments.some((d) => d._id.toString() === doc)
      );

      // If there are new documents, add them to the manpower's documents array
      if (newDocuments.length > 0) {
        manpower.documents.push(...newDocuments);
      }
    }

    // Save the updated manpower details
    await manpower.save();

    return res.json({ message: "Work details updated successfully", manpower });
  } catch (error) {
    console.error("Error updating manpower work details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.manpowerDocument = async (req, res) => {
  try {
    // let profile = req.files["profile"];
    let Aadhar = req.files["aadharCard"];
    let panCard = req.files["panCard"];

    req.body.AadharCard = Aadhar[0].path;
    req.body.uploadPanCard = panCard[0].path;

    const manpower = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          panCard: req.body.uploadPanCard,
          aadharCard: req.body.AadharCard,
        },
      },
      { new: true }
    );

    return res.json({
      message: "Aadhar Card and PAN Card documents uploaded successfully",
      data: manpower,
    });
  } catch (error) {
    console.error("Error uploading documents:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


exports.sendotpManpowerLogin = async (req, res) => {
  console.log("hi");
  try {
    const { phoneNumber } = req.body

    const otp = Math.floor(1000 + Math.random() * 9000)

    const user = await User.findOneAndUpdate({ mobile: phoneNumber, userType: "manpower" }, { otp: otp }, { new: true })
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


exports.loginManpower = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({ error: "Mobile number required" });
    }
    // Generate a random 6-digit OTP
    // const otp = Math.floor(1000 + Math.random() * 9000);

    // Create and send the SMS with the OTP
    // await client.messages.create({
    //   to: mobile,
    //   from: twilioPhoneNumber,
    //   body: `Your OTP is: ${otp}`,
    // });

    const manpower = await User.findOne({ mobile: mobile, userType: "manpower" });
    if (manpower) {
      const manpower1 = await User.findOne({ mobile: mobile, userType: "manpower", otp: otp });
      if (!manpower1) {

        return res.status(404).json({ error: "Otp is incorrect" });
      }
    }
    else {
      return res.status(404).json({ error: "manpower not found" });
    }


    // manpower.otp = otp
    // manpower.save()


    const token = jwt.sign({ manpowerId: manpower._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        otp,
        manpower: manpower,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}



exports.YourProfileUpdate = async (req, res) => {
  try {
    let ProfileUpdate = req.files["profile"];
    req.body.pro = ProfileUpdate[0].path;
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


exports.getAllManpower = async (req, res) => {
  try {
    const users = await User.find({ userType: "manpower" }).lean();
    res.status(200).json({ message: "users fetched successfully", data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


exports.getManpower = async (req, res) => {
  const { manpowerId } = req.params;

  try {
    // Check if a user with the given userId exists in the database
    const user = await User.findById(manpowerId).lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    // Send a response with the user information
    return res.status(200).json({ message: "User retrieved successfully", data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}


exports.DeleteManpower = async (req, res) => {
  const { manpowerId } = req.params;
  try {
    const user = await User.findByIdAndDelete(manpowerId);
    if (!user) {
      res.status(404).json({ message: "Manpower not found" });
    }
    return res
      .status(200)
      .json({ message: "Manpower Deleted successfully", data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}


exports.getManpowerWhoHaveApplied = async (req, res) => {
  const manpowerId = req.params.manpowerId;

  try {
    const posts = await User.find({
      userType: 'employer',
      'obj.manpower': manpowerId, // Use $elemMatch to find a specific element in the array
    }, {
      'obj.$': 1, // Project only the matching element
      'employerName': 1, // Include the employerName field
      'mobile': 1, // Include the mobile field
    });

    return res.json({ msg: "success", posts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


exports.getManpowerWhoHaveAppliedforInstantOrDirect = async (req, res) => {
  const manpowerId = req.query.manpowerId;
  const instantOrDirect = req.query.instantOrDirect; // Add this query parameter

  try {
    // Find all posts where manpowerId exists in the 'obj.manpower' array,
    // userType is 'employer', and instantOrdirect matches the query parameter
    const posts = await User.find({
      'obj.manpower': manpowerId,
      userType: 'employer',
      'obj.instantOrdirect': instantOrDirect,
    });

    if (!posts || posts.length === 0) {
      return res.json({ msg: "No posts available for this manpower" });
    }

    // Extract only the desired data from the posts
    const extractedData = posts.reduce((result, post) => {
      post.obj.forEach(objItem => {
        if (
          objItem.manpower &&
          objItem.manpower.toString() === manpowerId.toString() &&
          objItem.instantOrdirect === instantOrDirect
        ) {
          const employerName = post.employerName || "Unknown Employer"; // Use employerName from the post or set a default value
          result.push({
            job_desc: objItem.job_desc,
            siteLocation: objItem.siteLocation,
            category: objItem.category,
            explainYourWork: objItem.explainYourWork,
            date: objItem.date,
            lati: objItem.lati,
            longi: objItem.longi,
            instantOrdirect: objItem.instantOrdirect,
            orderId: objItem.orderId,
            employerName: employerName, // Include the employer name
            startTime: objItem.startTime,
            endTime: objItem.endTime,
            manpower: objItem.manpower,
          });
        }
      });
      return result;
    }, []);

    return res.json({ msg: "success", posts: extractedData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}







