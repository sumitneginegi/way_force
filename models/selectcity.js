const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const citySchema = mongoose.Schema({
  selectcity : {
    type:String
  },
  state: {
    type: mongoose.Schema.Types.String,  // Ensure that the type is String, as you mentioned it's stored as a string
    ref: 'state',  // Make sure it references the 'Category' model
  },
});
const cityModel = mongoose.model("city", citySchema);

module.exports = cityModel;
