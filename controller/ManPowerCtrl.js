const ManPower = require("../models/ManPowerModel")
const OTP = require("../config/OTP-Generate")
const Employerr = require("../models/employerModel")
const Manpowerr = require("../models/ManPowerModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const twilio = require("twilio");
// var newOTP = require("otp-generators");
const User = require("../models/user")


const accountSid = "AC0f17e37b275ea67e2e66d289b3a0ef84";
const authToken = "55fa82795d6e59230fd33ad418ed9891";
// const authToken ="4fd6915b4c0dadbc1deef2fec4a8f85";
const twilioPhoneNumber = "+14708354405";
const client = twilio(accountSid, authToken);


exports.registrationManpower = async (req, res) => {
  try {

    const { mobile,otp } = req.body;

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
      return res.status(409).send({ status: 409, msg: "Already Exit" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

exports.sendotpManpower = async (req, res) => {
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

    res.status(200).json({ message: "OTP sent successfully",otp:otp });
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
      name,
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
    } = req.body;

    // Check if the user exists
    const manPower = await User.findById(id);
    if (!manPower) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's details
    manPower.name = name;
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
        data:manpower,
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
}

exports.loginManpower = async (req, res) => {
  try {
    const { mobile,otp } = req.body;

    if (!mobile ) {
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

    const manpower = await User.findOne({ mobile:mobile , userType: "manpower"});
    if (!manpower) {
      return res.status(404).json({ error: "Manpower not found" });
    }

    manpower.otp = otp
    manpower.save()


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
    const users = await User.find({userType: "manpower" }).lean();
    res.status(200).json({message:"users fetched successfully", data:users});
  } catch (err) {
    console.error(err);
    res.status(500).json({error:err.message});
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
    return res.status(200).json({ message: "User retrieved successfully", data:user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error:err.message });
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



