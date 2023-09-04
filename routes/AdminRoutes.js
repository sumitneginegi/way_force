const express = require("express");
const router = express.Router();
const multer = require("multer");
// const path = require("path");
const { uploadUserData,/* uploadAgentData, uploadEmployerData*/ } = require("../controller/excel");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post("/upload", upload.single("csvFile"), uploadManpowerData);
// router.post("/upload/employer", upload.single("employer"), uploadEmployerData);
router.post("/upload/manpower", upload.single("file"), uploadUserData);
// router.post("/upload/agent", upload.single("agent"), uploadAgentData);
 
module.exports = router;
