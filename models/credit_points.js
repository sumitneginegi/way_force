const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
  
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  otp: {
    type: String,
    default: "",
  },
  otpVerification: {
    type: Boolean,
    default: false,
  },
  otpExpire: {
    type: Date,
  },
  profileImage: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/008/154/360/small/student-logo-vector.jpg",
  },
  school: {
    type: objectid,
    ref: "school",
  },
  member: {
    type: String,
    default: "",
  },
  latitude: {
    type: String,
    default: "",
  },
  longitude: {
    type: String,
    default: "",
  },
  pinCode: {
    type: String,
  },
  educationlevel: {
    type: String,
    default: "",
  },
  grade: {
    type: String,
    default: "",
  },
  age: {
    type: String,
    default: "",
  },
  state: {
    type: objectid,
    ref: "state",
  },
  city: {
    type: objectid,
    ref: "city",
  },
 
  
 
  userType: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER"
  },
  status: {
    type: String,
    enum: ["Active", "Block", "Delete"],
    default: "Active"
  },

}, { timestamps: true });

const userModel = mongoose.model("userProfile", userSchema);
module.exports = userModel;