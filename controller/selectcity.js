const cityModel = require('../models/selectcity');

exports.createCity = async (req, res) => {
  try {
    const { selectcity ,state} = req.body;
    const newCity = await cityModel.create({ selectcity,state });
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
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



exports.updateCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectcity,state } = req.body;
    const updatedCity = await cityModel.findByIdAndUpdate(id, { selectcity,state }, { new: true });
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
