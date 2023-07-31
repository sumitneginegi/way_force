const mongoose = require("mongoose")

const agentSchema = new mongoose.Schema({
  mobile: { type: String, unique: true },
  otp: Number,
  isProfileCompleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  isRegistred: { type: Boolean, default: false },
  registerDate: { type: Date, default: () => Date.now() },
  name: String,
  photo: String,
  address: String,
  businessName: String,
  serviceLocation: String,
  gstNumber: String,
  lat: Number,
  lng: Number,
  registrationNumber: String,
  labour: [{ skill: Schema.Types.ObjectId, strength: Number }],
  documents: [
    { documentName: String, documentImage: String, documentNumber: String },
  ],
});

module.exports = mongoose.model("Agent", agentSchema);
