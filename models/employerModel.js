const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = mongoose.Types.ObjectId;

const EmployerSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
    },
    otp: {
      type: String,
    },
    job_desc: {
      type: String,
    },
    city: {
      type: objectId,
      ref: "city"
    },
    siteLocation: {
      type: String,
    },
    employmentType: {
      type: String,
      enum: ["manpower", "agent"],
      default: "manpower",
    },
    category: {
      type: objectId,
      ref: "Category"
    },
    no_Of_opening: {
      type: String,
    },
    fullTime: {
      type: String,
      enum: ["fullTime", "partTime"],
      default: "fullTime",
    },
    miniSalary: {
      type: String,
    },
    maxSalary: {
      type: String,
    },
    workingDays: {
      type: Array,
    },
    workingHours: {
      type: String,
    },
    explainYourWork: {
      type: String,
    },
    date: {
      type: String,
    },
    apply: {
      type: String,
      default: "false"
    },
    manpowerId: {
      type: objectId,
      ref: "ManPower",
    },
    mobileVerified: {
      type: Boolean,
      default: false,
    },
    /////////////////////////////
    state: {
      type: String,
      ref: "state"
    },
    pinCode: {
      type: String
    },
    GST_Number: {
      type: String
    },
    registration_Number: {
      type: String
    },
    lati: {
      type: String
    },
    longi: {
      type: String
    },
    instantOrdirect: {
      type: String
    },
    otpSendToEmployer: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

const Employer = mongoose.model("Employer", EmployerSchema);
module.exports = Employer;