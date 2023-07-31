const express = require("express");
const {
    signupEmployer,
    verifyOtpEmployer,
    detailDirectEmployer,
    detailInstantEmployer,
    getAllEmployer,
    getAllEmployerById,
    updatebyManpoweridEmployer,
    getInstanOrDirect,
    loginWithPhone,
    verifyOtpByManpower,
    manpowerDocument,
    registrationEmployer
} = require("../controller/employerCtrl");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer();


cloudinary.config({
  cloud_name: "dsi1yv3xi",
  api_key: "343572995738873",
  api_secret: "wrcHAy3wkDu8jhv0UHYlMpYmdDQ",
});

router.post("/registration/Employer", registrationEmployer);
router.post("/signup", signupEmployer);
router.post("/login", loginWithPhone);
router.post("/verify/otp/:id", verifyOtpEmployer);
router.get("/getAll", getAllEmployer);
router.get("/:id", getAllEmployerById);
router.put("/direct/detail/:id", detailDirectEmployer);
router.put("/updatebyManpoweridEmployer/:id", updatebyManpoweridEmployer);
router.put("/instant/detail/:id", detailInstantEmployer);
router.get("/getInstanOrDirect", getInstanOrDirect);
// router.post("/upload/documents/:id",
//   upload.fields([{ name: "aadharCard" }, { name: "panCard" }]),
//   manpowerDocument
// );

router.post("/verifyOtpByManpower/:manpowerid", verifyOtpByManpower);

module.exports = router;
