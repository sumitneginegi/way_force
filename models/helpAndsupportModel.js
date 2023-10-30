const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const helpAndSupportSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String
    },
    message: {
      type: String,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("HelpAndSupport", helpAndSupportSchema);
