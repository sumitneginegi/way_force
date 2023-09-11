const HelpAndSupport = require("../models/helpAndsupportModel");



exports.AddQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newRequest = new HelpAndSupport({
      name,
      email,
      subject,
      message,
    });

    await newRequest.save();

    return res.json({ message: "Help and support request submitted successfully", request: newRequest });
  } catch (error) {
    console.error("Error submitting help and support request:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}


exports.getAllQuery = async (req, res) => {
  try {
    // Retrieve all help and support requests from the database
    const requests = await HelpAndSupport.find();

    return res.json(requests);
  } catch (error) {
    console.error("Error fetching help and support requests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



exports.updateQuery = async (req, res) => {
  try {
    const requestId = req.params.id
    const { status, assignedTo, resolvedBy } = req.body

    // Validate the status field
    if (!status || !["Open", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status provided" })
    }

    // Retrieve the help and support request from the database
    const request = await HelpAndSupport.findById(requestId)

    if (!request) {
      return res.status(404).json({ error: "Help and support request not found" })
    }

    // Update the request details based on the provided data
    request.status = status;
    if (status === "Resolved") {
      request.resolvedBy = resolvedBy;
    } else {
      request.assignedTo = assignedTo;
    }

    // Save the updated request in the database
    await request.save();

    return res.json({ message: "Help and support request updated successfully", request })
  } catch (error) {
    console.error("Error updating help and support request:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
};


exports.deleteQuery = async (req, res) => {
    try {
    const request = await HelpAndSupport.findByIdAndDelete({userId: req.params.id});

        return res.json({
            message:"delete Successfully",
            data: request});
  } catch (error) {
    console.error("Error fetching help and support requests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

