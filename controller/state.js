const stateModel = require('../models/state');

exports.createState = async (req, res) => {
  try {
    const { state } = req.body;
    const newstate = await stateModel.create({ state });
    res.status(201).json(newstate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getState = async (req, res) => {
  try {
    const states = await stateModel.find();
    if (!states) {
      return res.status(400).json({ error: "states data not provided" });
    }
    res.status(201).json({ success: true, data: states })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const updatedState = await stateModel.findByIdAndUpdate(id, { state }, { new: true });
    res.status(201).json({ success: true, data: updatedState })
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteState = async (req, res) => {
  try {
    const { id } = req.params;
    await stateModel.findByIdAndDelete(id);
    res.json({ message: 'state deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
