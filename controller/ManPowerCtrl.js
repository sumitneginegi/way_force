const ManPower = require("../models/ManPowerModel")
const OTP = require("../config/OTP-Generate")
const Employerr = require("../models/employerModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const twilio = require("twilio");
// var newOTP = require("otp-generators");
const User = require("../models/user")
const mongoose = require("mongoose");
const haversine = require('haversine');


const accountSid = "AC0f17e37b275ea67e2e66d289b3a0ef84";
const authToken = "55fa82795d6e59230fd33ad418ed9891";
// const authToken ="4fd6915b4c0dadbc1deef2fec4a8f85";
const twilioPhoneNumber = "+14708354405";
const client = twilio(accountSid, authToken);



// exports.registrationManpowerAdmin = async (req, res) => {
//   try {

//     const data = {
//       manpowerName: req.body.manpowerName,
//       address: {
//         state: req.body.state,
//         city: req.body.city,
//         country: req.body.country,
//         pinCode: req.body.pinCode,
//         landmark: req.body.landmark,
//         postOffice: req.body.postOffice,
//         line: req.body.line,
//         village: req.body.village,
//         block: req.body.block
//       },
//       education: [
//         {
//           educationType: req.body.educationType,
//           degree: req.body.degree,
//           yearOfPassing: req.body.yearOfPassing
//         },
//         {
//           educationType: req.body.educationType,
//           degree: req.body.degree,
//           yearOfPassing: req.body.yearOfPassing
//         }
//       ],
//       age: req.body.age,
//       gender: req.body.gender,
//       dob: req.body.dob,
//       email: req.body.email,
//       language: [],
//       bio: req.body.bio,
//       experience: req.body.experience,
//       minSalary: req.body.minSalary,
//       maxSalary: req.body.maxSalary,
//       jobType: req.body.jobType,
//       siteLocation: req.body.siteLocation,
//       serviceLocation: {
//         lati: req.body.lati,
//         longi: req.body.longi
//       },
//       documents: [
//         {
//           documentName: req.body.documentName,
//           documentNumber: req.body.documentNumber,
//           documentImage: req.body.documentImage
//         },
//         {
//           documentName: req.body.documentName,
//           documentNumber: req.body.documentNumber,
//           documentImage: req.body.documentImage
//         }
//       ]
//     }


//     var user = await User.findOne({ mobile: data.mobile, userType: "manpower" })

//     if (user) {
//       return res.json({ status: 409, message: "Already Exit" });
//     } else {
//       req.body.userType = "manpower"


//       const userCreate = await User.create({
//         data,
//         ...req.body
//       })

//       let obj = {
//         id: userCreate._id,
//         mobile: userCreate.mobile,
//         manpowerName: data.manpowerName,
//         address: {
//           state: data.address.state,
//           city: data.address.city,
//           country: data.address.country,
//           pinCode: data.address.pinCode,
//           landmark: data.address.landmark,
//           postOffice: data.address.postOffice,
//           line: data.address.line,
//           village: data.address.village,
//           block: data.address.block,
//         },
//         education: [
//           {
//             educationType: data.education[0].educationType,
//             degree: data.education[0].degree,
//             yearOfPassing: data.education[0].yearOfPassing,
//           },
//           {
//             educationType: data.education[1].educationType,
//             degree: data.education[1].degree,
//             yearOfPassing: data.education[1].yearOfPassing,
//           },
//         ],
//         age: data.age,
//         gender: data.gender,
//         dob: data.dob,
//         email: data.email,
//         language: data.language,
//         bio: data.bio,
//         experience: data.experience,
//         minSalary: data.minSalary,
//         maxSalary: data.maxSalary,
//         jobType: data.jobType,
//         siteLocation: data.siteLocation,
//         serviceLocation: {
//           lati: data.serviceLocation.lati,
//           longi: data.serviceLocation.longi,
//         },
//         documents: [
//           {
//             documentName: data.documents[0].documentName,
//             documentNumber: data.documents[0].documentNumber,
//             documentImage: data.documents[0].documentImage,
//           },
//           {
//             documentName: data.documents[1].documentName,
//             documentNumber: data.documents[1].documentNumber,
//             documentImage: data.documents[1].documentImage,
//           },
//         ]
//       }


//       return res.status(201).send({
//         status: 200,
//         message: "Registered successfully ",
//         data: obj
//       })
//     }

//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: "Server error" });
//   }
// }


exports.registrationManpowerAdmin = async (req, res) => {
  try {
    const data = {
      manpowerName: req.body.manpowerName,
      mobile:req.body.mobile,
      address: {
        state: req.body.state,
        city: req.body.city,
        country: req.body.country,
        pinCode: req.body.pinCode,
        landmark: req.body.landmark,
        postOffice: req.body.postOffice,
        line: req.body.line,
        village: req.body.village,
        block: req.body.block,
      },
      education: [], // Initialize an empty array for education
      age: req.body.age,
      gender: req.body.gender,
      dob: req.body.dob,
      email: req.body.email,
      language: [],
      bio: req.body.bio,
      experience: req.body.experience,
      minSalary: req.body.minSalary,
      maxSalary: req.body.maxSalary,
      jobType: req.body.jobType,
      siteLocation: req.body.siteLocation,
      serviceLocation: {
        lati: req.body.latitude,
        longi: req.body.longitude,
      },
      documents: [], // Initialize an empty array for documents
      category: req.body.category,
      workingDays: req.body.workingDays,
      workingHours: req.body.workingHours,
      uploadPanCard: req.body.uploadPanCard,
      panCard: req.body.panCard,
      uploadAadharCard: req.body.uploadAadharCard,
      aadharCard: req.body.aadharCard,
      profile: req.body.profile,
      skills: req.body.skills, // An array of skill references
    };

    // Add education and documents objects to the arrays
    // for (let i = 0; i < req.body.education.length; i++) {
    //   data.education.push({
    //     educationType: req.body.education[i].educationType,
    //     degree: req.body.education[i].degree,
    //     yearOfPassing: req.body.education[i].yearOfPassing,
    //   });
    // }

    // if (req.body.education && Array.isArray(req.body.education)) {
      for (let i = 0; i < req.body.education.length; i++) {
        data.education.push({
          educationType: req.body.education[i].educationType,
          degree: req.body.education[i].degree,
          yearOfPassing: req.body.education[i].yearOfPassing,
        });
      }
    // } else {
    //   return res.status(400).json({ message: "Invalid education data" });
    // }


    // if (req.body.documents && Array.isArray(req.body.documents)) {
      for (let i = 0; i < req.body.documents.length; i++) {
        data.documents.push({
          documentName: req.body.documents[i].documentName,
          documentNumber: req.body.documents[i].documentNumber,
          documentImage: req.body.documents[i].documentImage,
        });
      }
    // } else {
    //   return res.status(400).json({ message: "Invalid document data" });
    // }

    var user = await User.findOne({ mobile: data.mobile, userType: "manpower" });

    if (user) {
      return res.json({ status: 409, message: "Already Exists" });
    } else {
      req.body.userType = "manpower";

      const userCreate = await User.create({
        ...data,
        ...req.body,
      });

      return res.status(201).send({
        status: 200,
        message: "Registered successfully",
        data: userCreate,
      });
    }
  } catch (error) {
    console.error(error);
   return res.status(500).json({ message: "Server error" });
  }
};



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
// Generate a random 4-digit OTP
const otp = Math.floor(1000 + Math.random() * 9000);

// Check if a user with the provided mobile number and userType "employer" already exists
const user = await User.findOne({ mobile: phoneNumber, userType: "manpower" });

if (!user) {
  // If the user doesn't exist, create a new user with the provided details
  req.body.userType = "manpower";
  req.body.wallet = 100;

  const userCreate = await User.create({
    mobile: phoneNumber,
    otp: otp,
    ...req.body
  });

  return res.status(200).json({ message: "OTP sent successfully", mobile: phoneNumber, otp: otp });
} else {
  // If a user with the same mobile number and userType "employer" exists, return an error
  return res.status(400).json({ message: "User already exists" });
}
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

    return res
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
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "users fetched successfully", data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}


// exports.getAllManpowerthroughCategory = async (req, res) => {
//   try {
//     const { category } = req.params;

//     if (!category) {
//       return res.status(400).json({ message: "Category parameter is missing" });
//     }

//     const users = await User.find({ userType: "manpower", category }).lean();

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "No manpower users found for the specified category", data: null });
//     }

//     return res.status(200).send({ message: "Manpower users fetched successfully", data: users });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Internal server error", error: err.message, data: null });
//   }
// };


exports.getAllManpowerthroughCategory = async (req, res) => {
  try {
    const { category, employerid } = req.params;

    if (!category || !employerid) {
      return res.status(400).json({ message: "Category or _id parameter is missing" });
    }

    const employer = await User.findById(employerid).lean();
    if (!employer || employer.userType !== 'employer') {
      return res.status(404).json({ message: "Employer not found with the specified _id" });
    }
    // Extract the current_lati and current_longi from the employer's data
    const current_lati = employer.current_lati;
    const current_longi = employer.current_longi;

    const manpowerUsers = await User.find({ userType: "manpower", category }).lean();
    console.log(manpowerUsers);
    // Calculate distances and add them to each manpower user
    manpowerUsers.forEach(user => {
      if (user.serviceLocation && user.serviceLocation.lati && user.serviceLocation.longi) {
        const manpowerLocation = {
          latitude: user.serviceLocation.lati,
          longitude: user.serviceLocation.longi,
        };
        const employerLocation = { latitude: current_lati, longitude: current_longi };
        user.distance = haversine(manpowerLocation, employerLocation, { unit: 'km' });
        console.log(user.distance);
      } else {
        user.distance = null;
      }
    });

    // Sort manpower users by distance in ascending order
    manpowerUsers.sort((a, b) => {
      if (a.distance < b.distance) {
        return -1;
      }
      if (a.distance > b.distance) {
        return 1;
      }
      return 0;
    });

    return res.status(200).send({ message: "Manpower users fetched and sorted successfully", data: manpowerUsers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error", error: err.message, data: null });
  }
};




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




// Define the PUT API route to update lati, longi, and siteLocation for a specific "manpower" user
exports.updateManpowerLocation = async (req, res) => {
  const { lati, longi, siteLocation } = req.body;
  const id = req.params.id;

  try {
    // Find the "manpower" user by their _id and userType
    const updateFields = {};

    if (lati !== undefined) {
      updateFields['serviceLocation.lati'] = lati;
    }

    if (longi !== undefined) {
      updateFields['serviceLocation.longi'] = longi;
    }

    if (siteLocation !== undefined) {
      updateFields['siteLocation'] = siteLocation || ''
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: id,
        userType: 'manpower',
      },
      {
        $set: updateFields,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'Manpower user not found' });
    }

    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



exports.updateCategoryForManpower = async (req, res) => {
  try {
    // Define the condition to find users with userType "manpower" and no category set
    const condition = { userType: "manpower", category: { $exists: false } };

    // Define the update operation (setting the category field)
    const update = { $set: { category: "defaultCategory" } }; // Set the default category value

    // Use updateMany to update documents that match the condition
    const result = await User.updateMany(condition, update);

    return res.status(200).json({ message: "Category field added to manpower users", updatedCount: result.nModified });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};





exports.getManpowerthroughFilter = async (req, res) => {
  try {
    const { siteLocation, category } = req.query;
    const userType = "manpower";

    // Define query conditions based on request parameters
    const queryConditions = {
      userType: { $regex: new RegExp(userType, 'i') }, // Case-insensitive regex
    };

    if (siteLocation) {
      queryConditions.siteLocation = { $regex: new RegExp(siteLocation, 'i') };
    }

    if (category) {
      queryConditions.category = { $regex: new RegExp(category, 'i') };
    }

    // Find all manpowers based on the query conditions
    const manpowers = await User.find(queryConditions).lean();

    // Send a response with the matched manpowers
    return res.status(200).json({ message: "Manpowers retrieved successfully", data: manpowers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};



exports.getAllManpowerUniqueCategory = async (req, res) => {
  try {
    const users = await User.find({ userType: "manpower" }).distinct("category");

    if (users.length === 0) {
      return res.status(404).json({ message: "No manpower users found" });
    }

    // Send a response with the unique category names
    return res.status(200).json({ message: "Unique category names retrieved successfully", data: users });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};