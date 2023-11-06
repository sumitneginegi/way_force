const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;
const bookingSchema = mongoose.Schema(
  {
    employerId: { type: objectid, ref: "User" },
    userId: { type: objectid, ref: "User" },
    Status: {
      type: String,
      default: "pending",
    },
    amount_per_hour : { type: Number, default: 0 },
    startTime : {
      type: String
    },
    endTime : {
      type: String
    },
    diff :{
      type:String
    },
    payment : {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },
    workDetails : {
      type: String
    },
    workDurationInYear : {
      type: String
    },
    date : {
      type: String
    },
    workLocation: {
      address: {
        type: String
      },
      landmark: {
        type: String
      },
      village: {
        type: String
      },
      street_Number: {
        type: String
      }
    },
        
    startDate: {
      type: String
    },

    // start_time: { type: String },
    // end_time: { type: String },
    // now_schedule: { type: String },
    // rewards: { type: String },
    // timer: { type: String },
    lati:{type:String},
    longi:{type:String},
    instantOrdirect: String,
    acceptOrDecline: String,
    otp:String
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("bookingByEmployer", bookingSchema);
