const cityModel = require('../models/selectcity');
const stateModel = require("../models/state")

exports.createCity = async (req, res) => {
  try {
    const { selectcity, state } = req.body;

    // Find the state with the provided stateName
    const stateData = await stateModel.findOne({ state: { $regex: new RegExp(state, 'i') } });

    if (!stateData) {
      return res.status(400).json({ message: "State not found" });
    }


    // Check if a city with the same name and state already exists
    const existingCity = await cityModel.findOne({ selectcity, state: stateData._id });

    if (existingCity) {
      return res.status(400).json({ message: "City already exists in this state" });
    }

    const newCity = await cityModel.create({ selectcity, state: stateData._id });
    return res.status(201).json(newCity);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};



exports.getCity = async (req, res) => {
  try {
    const cities = await cityModel.find();
    if (!cities) {
      return res.status(400).json({ error: "cities data not provided" });
    }
    res.status(201).json({ success: true, data: cities })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getCityBystateId = async (req, res) => {
  try {
    const stateId = req.params.stateId;

    // Find all cities with the specified state ObjectId
    const cities = await cityModel.find({ state: stateId });

    if (!cities) {
      return res.status(404).json({ message: 'Cities not found' });
    }

    return res.status(200).json({ cities });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



exports.getCityBySelectCity = async (req, res) => {
  try {
    
    // Find all cities with the specified selectcity name
    const cities = await cityModel.find({ selectcity: req.params.selectcity });

    if (!cities || cities.length === 0) {
      return res.status(404).json({ message: 'Cities not found' });
    }

    return res.status(200).json({ cities });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectcity, state } = req.body;
    const updatedCity = await cityModel.findByIdAndUpdate(id, { selectcity, state }, { new: true });
    res.status(201).json({ success: true, data: updatedCity })
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    await cityModel.findByIdAndDelete(id);
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
