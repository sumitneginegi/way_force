const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;
const categorySchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, "name Category Required"],
  },
  price:{
    type:String
  }
//   images: [{
//       img: {
//           type: String
//       }
//   }]
,
  status: {
      type: String,
      enum: ["Active", "Block"],
      default: "Active"
  },
})

module.exports = mongoose.model("Category", categorySchema);
