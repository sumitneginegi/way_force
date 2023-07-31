const mongoose = require("mongoose");

const stateSchema = mongoose.Schema({
  state : {
    type:String
  },
});
const stateModel = mongoose.model("state", stateSchema);

module.exports = stateModel;
