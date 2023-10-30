const HelpAndSupport = require('../models/helpAndsupportModel'); // Replace 'yourModelFilePath' with the actual path to your model file

exports.createHelpAndSupport = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const helpAndSupport = new HelpAndSupport({
      name,
      email,
      phone,
      message,
    });

    const savedHelpAndSupport = await helpAndSupport.save();

    return res.status(201).json(savedHelpAndSupport);
  } catch (error) {
    console.error("Error creating help and support request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getHelpAndSupport = async (req, res) => {
  try {
    const helpAndSupportList = await HelpAndSupport.find().lean();
    return res.status(200).json(helpAndSupportList);
  } catch (error) {
    console.error("Error fetching help and support requests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getHelpAndSupportById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const helpAndSupport = await HelpAndSupport.findById(requestId);

    if (!helpAndSupport) {
      return res.status(404).json({ error: "Help and support request not found" });
    }

    return res.status(200).json(helpAndSupport);
  } catch (error) {
    console.error("Error fetching help and support request by ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateHelpAndSupport = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { name, email, phone, message } = req.body;

    const helpAndSupport = await HelpAndSupport.findByIdAndUpdate(
      requestId,
      {
        name,
        email,
        phone,
        message,
      },
      { new: true }
    );

    if (!helpAndSupport) {
      return res.status(404).json({ error: "Help and support request not found" });
    }

    return res.status(200).json(helpAndSupport);
  } catch (error) {
    console.error("Error updating help and support request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteHelpAndSupport = async (req, res) => {
  try {
    const requestId = req.params.id;
    const helpAndSupport = await HelpAndSupport.findByIdAndRemove(requestId);

    if (!helpAndSupport) {
      return res.status(404).json({ error: "Help and support request not found" });
    }

    return res.status(204).send(); // No content, as the request has been deleted.
  } catch (error) {
    console.error("Error deleting help and support request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
