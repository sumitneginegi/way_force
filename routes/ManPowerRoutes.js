const express = require("express");
const {
  signupManpower,
  workDetails,
  manpowerDocument,
  verifyOtp,
  detailSignup,
  loginManpower,
  YourProfileUpdate,
  getAllManpower,
  getManpower,
  DeleteManpower,
  registrationManpower,
  sendotp
} = require("../controller/ManPowerCtrl");

const auth = require("../middleware/auth")

const router = express.Router();
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images/image",
    allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"],
  },
});
const upload = multer({ storage: storage });


cloudinary.config({
  cloud_name: "dsi1yv3xi",
  api_key: "343572995738873",
  api_secret: "wrcHAy3wkDu8jhv0UHYlMpYmdDQ",
});


router.post("/registration/Manpower", registrationManpower);
router.post("/sendotp", sendotp);
router.post("/signup", signupManpower);
router.post("/login", loginManpower);
router.post("/verify/otp/:id", verifyOtp);
router.put("/fill/details/:id",/*auth.verifyToken,*/ detailSignup);
router.post("/work-details/:id", workDetails);
router.put(
  "/upload/documents/:id",
  upload.fields([
    { name: "aadharCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },

  ]),
  manpowerDocument
);
router.put("/profile/:id", upload.fields([{ name: "profile", maxCount: 1 },]), YourProfileUpdate);
router.get("/", getAllManpower);
router.get("/:manpowerId", getManpower);
router.delete("/delete/:manpowerId", DeleteManpower);


module.exports = router;
