const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId;

const citySchema = mongoose.Schema({
  selectcity : {
    type:String
  },
  state:objectId
});
const cityModel = mongoose.model("city", citySchema);

module.exports = cityModel;
