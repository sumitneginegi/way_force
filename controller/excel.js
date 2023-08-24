// const fs = require("fs");
// const csvParser = require("csv-parser");

const User = require("../models/user");
const path = require("path");

// const multer = require("multer");
const xlsx = require("xlsx");

// const uploadManpowerData = async (req, res) => {
//   const filePath = req.file.path;

//   // Read the CSV file
//   const results = [];
//   fs.createReadStream(filePath)
//     .pipe(csvParser())
//     .on("data", (data) => results.push(data))
//     .on("end", () => {
//       // Save data to MongoDB
//       ManPower.insertMany(results, (err, manpower) => {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "Failed to upload data" });
//         }
//         fs.unlinkSync(filePath); // Remove the uploaded CSV file after processing
//         return res.status(200).json({ message: "Data uploaded successfully" });
//       });
//     });
// };

// app.post("/upload", upload.single("file"),


exports.uploadManpowerData = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse the uploaded Excel file.
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert the data into the database.
    const errors = [];
    for (const data of sheetData) {
      const manpower = new User(data);
      const validationError = manpower.validateSync();
      if (validationError) {
        errors.push({ data, error: validationError.errors });
      } else {
        manpower.save();
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



exports.uploadEmployerData = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse the uploaded Excel file.
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert the data into the database.
    const errors = [];
    for (const data of sheetData) {
      const employer = new User(data);
      const validationError = employer.validateSync();
      if (validationError) {
        errors.push({ data, error: validationError.errors });
      } else {
        employer.save();
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



exports.uploadAgentData = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse the uploaded Excel file.
    const workbook = xlsx.read(file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert the data into the database.
    const errors = [];
    for (const data of sheetData) {
      const agent = new User(data);
      const validationError = agent.validateSync();
      if (validationError) {
        errors.push({ data, error: validationError.errors });
      } else {
        agent.save();
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