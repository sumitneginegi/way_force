const mongoose = require("mongoose");

const citySchema = mongoose.Schema({
  selectcity : {
    type:String
  },
});
const cityModel = mongoose.model("city", citySchema);

module.exports = cityModel;
