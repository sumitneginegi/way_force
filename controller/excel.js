const User = require("../models/user");
// const path = require("path");

// const multer = require("multer");
const xlsx = require("xlsx");



exports.uploadUserData = (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const errors = [];
    for (const data of sheetData) {
      const userType = determineUserType(data);

      data.userType = userType;
      const user = new User(data);
      console.log(user);
      const validationError = user.validateSync();
      if (validationError) {
        errors.push({ data, error: validationError.errors });
      } else {
        user.save();
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    return res.status(200).json({ message: "Data uploaded successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

function determineUserType(data) {
  if (data.userType === "employer") {
    return "employer";
  } else if (data.userType === "manpower") {
    return "manpower";
  } else if (data.userType === "agent") {
    return "agent";
  } else {
    return "unknown";
  }
}



