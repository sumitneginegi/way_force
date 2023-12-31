const express = require("express");
const {
  signupManpower,
  workDetails,
  manpowerDocument,
  verifyOtp,
  detailSignup,
  loginManpower,
  sendotpManpowerLogin,
  YourProfileUpdate,
  getAllManpower,
  getManpower,
  DeleteManpower,
  registrationManpower,
  sendotpManpower,
  registrationManpowerAdmin,
  getManpowerWhoHaveApplied,
  getManpowerWhoHaveAppliedforInstantOrDirect,
  updateManpowerLocation,
  getAllManpowerthroughCategory,
  updateCategoryForManpower,
  getManpowerthroughFilter,
  getAllManpowerUniqueCategory,
  updateManpowerById
} = require("../controller/ManPowerCtrl");

const verifyToken = require("../middleware/auth");

// Define allowed roles for a specific API
const allowedRoles1 = ["admin", "subadmin", "employer"];
const allowedRoles2 = ["admin", "subadmin", "manpower"];
const allowedRoles3 = ["admin", "subadmin", "agent"];
const allowedRoles4 = ["admin", "subadmin"];
const allowedRoles5 = ["admin"];

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


router.post("/registrationManpowerAdmin",/*verifyToken.verifyToken(allowedRoles4), */ registrationManpowerAdmin);
router.post("/registration/Manpower", registrationManpower);
router.post("/sendotpManpower", sendotpManpower);
router.post("/signup", signupManpower);
router.post("/login", loginManpower);
router.post("/sendotpManpower/Login", sendotpManpowerLogin);
router.post("/verify/otp/:id", verifyOtp);
// router.put("/fill/details/:id",/*auth.verifyToken,*/ detailSignup);
router.post("/fill/details",/*auth.verifyToken,*/ detailSignup);
router.post("/work-details/:id", workDetails);
router.put(
  "/upload/documents/:id",
  upload.fields([
    { name: "aadharCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },

  ]),
  manpowerDocument
)
router.put("/profile/:id", upload.fields([{ name: "profile", maxCount: 1 },]), YourProfileUpdate);
router.get("/", getAllManpower);
router.get("/:manpowerId", getManpower);
router.delete("/delete/:manpowerId", DeleteManpower)
router.get("/getManpowerWhoHave/Applied/:manpowerId", getManpowerWhoHaveApplied)
router.get("/getManpowerWhoHaveAppliedfor/InstantOrDirect", getManpowerWhoHaveAppliedforInstantOrDirect)
router.put("/updateManpowerLocation/:id", updateManpowerLocation);

router.get("/getAllManpowerthrough/Category/:category/:employerid", getAllManpowerthroughCategory);
router.put("/updateCategoryFor/Manpower", updateCategoryForManpower);

router.get("/getManpowerthrough/Filter", getManpowerthroughFilter);
router.get("/getAllManpower/UniqueCategory", getAllManpowerUniqueCategory);
router.put("/updateManpowerById/:id", updateManpowerById);





;
module.exports = router;
