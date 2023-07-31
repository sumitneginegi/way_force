const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const manPowerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
    },
    address: {
      state: String,
      city: String,
      country: String,
      pinCode: Number,
      landmark: String,
      postOffice: String,
      address: String,
      village: String,
      block: String,
    },
    mobile: {
      type: String,
      // required: true,
      // unique: true,
    },
    education: [
      { educationType: String, degree: String, yearOfPassing: String },
    ],
    age: Number,
    gender: String,
    dob: Date,
    language: [String],
    bio: String,
    experience: Number,
    minSalary: { type: Number },
    maxSalary: { type: Number },
    skills: [{ type: Schema.Types.ObjectId }],
    jobType: { type: String },
    serviceLocation: String,
    documents: [
      { documentName: String, documentNumber: String, documentImage: String },
    ],
    myProjects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    active: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    aadharCard: {
      type: String,
    },
    panCard: {
      type: String,
    },
    profile: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ManPower', manPowerSchema);