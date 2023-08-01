const Employerr = require("../models/employerModel");
const Manpowerr = require("../models/ManPowerModel");
const OTP = require("../config/OTP-Generate");
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



exports.registrationEmployer = async (req, res) => {
  try {
    var { mobile } = req.body
    var user = await User.findOne({ mobile: mobile, userType: "employer" })

    if (!user) {
      // req.body.otp = OTP.generateOTP()
      // req.body.otpExpiration = new Date(Date.now() + 5 * 60 * 1000)
      // req.body.accountVerification = false
      req.body.userType = "employer"

      // let referalUser = null;

      const userCreate = await User.create({
        mobile,
        // referalCodeUnique,
        ...req.body
      })

      let obj = {
        id: userCreate._id,
        // otp: userCreate.otp,
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
    const {
      mobile,
      job_desc,
      city,
      siteLocation,
      employmentType,
      category,
      no_Of_opening,
      fullTime,
      miniSalary,
      maxSalary,
      workingDays,
      workingHours,
      explainYourWork,
      date,
      manpowerId,
      mobileVerified,
      instantOrdirect

    } = req.body;

    let employer = await Employerr.findOne({ mobile });

    if (!employer) {
      return res.status(404).json({ error: "User not found" });
    }

    employer.mobile = mobile;
    employer.job_desc = job_desc;
    employer.city = city;
    employer.siteLocation = siteLocation;
    employer.employmentType = employmentType;
    employer.category = category;
    employer.no_Of_opening = no_Of_opening;
    employer.fullTime = fullTime;
    employer.miniSalary = miniSalary;
    employer.maxSalary = maxSalary;
    employer.workingDays = workingDays;
    employer.workingHours = workingHours;
    employer.explainYourWork = explainYourWork;
    employer.date = date;
    employer.manpowerId = manpowerId;
    employer.mobileVerified = mobileVerified;
    employer.instantOrdirect = instantOrdirect,

      await employer.save();

    res
      .status(200)
      .json({ message: "Details filled successfully", data: employer });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong"
    });
  }
}

exports.detailInstantEmployer = async (req, res) => {
  try {
    const {
      mobile,
      job_desc,
      city,
      siteLocation,
      employmentType,
      category,
      no_Of_opening,
      fullTime,
      miniSalary,
      maxSalary,
      workingDays,
      workingHours,
      explainYourWork,
      date,
      manpowerId,
      mobileVerified,
      state,
      pinCode,
      GST_Number,
      registration_Number,
      lati,
      longi,
      instantOrdirect,
    } = req.body;

    let employer = await Employerr.findOne({ mobile });

    if (!employer) {
      return res.status(404).json({ error: "User not found" });
    }

    employer.mobile = mobile;
    employer.job_desc = job_desc;
    employer.city = city;
    employer.siteLocation = siteLocation;
    employer.employmentType = employmentType;
    employer.category = category;
    employer.no_Of_opening = no_Of_opening;
    employer.fullTime = fullTime;
    employer.miniSalary = miniSalary;
    employer.maxSalary = maxSalary;
    employer.workingDays = workingDays;
    employer.workingHours = workingHours;
    employer.explainYourWork = explainYourWork;
    employer.date = date;
    employer.manpowerId = manpowerId;
    employer.mobileVerified = mobileVerified;
    employer.state = state,
      employer.pinCode = pinCode,
      employer.GST_Number = GST_Number,
      employer.registration_Number = registration_Number,
      employer.lati = lati,
      employer.longi = longi,
      employer.instantOrdirect = instantOrdirect,


      await employer.save();

    res
      .status(200)
      .json({ message: "Details filled successfully", data: employer });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong" });
  }
}


exports.getAllEmployer = async (req, res) => {
  try {
    const employer = await Employerr.find()
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


exports.getInstanOrDirect = async (req, res) => {
  try {
    const { instantOrdirect } = req.query;

    // Build the filter object based on the provided query parameters
    const filter = {}
    // if (city) filter.city = city;
    // if (category) filter.category = category;
    // if (employmentType) filter.employmentType = employmentType;
    if (instantOrdirect) filter.instantOrdirect = instantOrdirect;

    // Query the database with the filter
    const employers = await Employerr.find(filter);

    // Send the filtered employers as a response
    res.status(200).json(employers);

    if (employers.length == 0) {
      res.status(404).send({ status: 404, message: "employee not found.", data: {} });
    } else {
      res.status(200).send({ status: 200, message: "Job Found successfully.", data: employers });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, error: "Internal server error" })
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
};


exports.updatebyManpoweridEmployer = async (req, res) => {
  try {
    const data = {
      apply,
      manpowerId,
    } = req.body;

    const otp = OTP.generateOTP();
    let employer = await Employerr.findOne({ _id: req.params.id })

    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }
    employer.apply = data.apply,
      employer.manpowerId = data.manpowerId,
      employer.otpSendToEmployer = otp

    await employer.save()

    let manppowerr = await Manpowerr.findOne({ _id: data.manpowerId })
    if (!manppowerr) {
      return res.status(404).json({ error: "manppowerr not found" });
    }
    manppowerr.otpSendToManpowerr = otp

    await manppowerr.save()

    res
      .status(200)
      .json({ message: "Details filled successfully", data: employer });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
}


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




