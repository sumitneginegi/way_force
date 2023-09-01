const express = require("express");
const router = express.Router();
const multer = require("multer");
// const path = require("path");
const { uploadManpowerData } = require("../controller/excel");

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
router.post("/upload", upload.single("file"), uploadManpowerData);
 
module.exports = router;
