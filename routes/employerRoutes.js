const express = require("express");
const {
    signupEmployer,
    verifyOtpEmployer,
    detailDirectEmployer,
    detailInstantEmployer,
    getAllEmployer,
    getAllEmployerById,
    updatebyManpoweridEmployer,
    updatebyAgentidEmployer,
    getInstanOrDirect,
    loginEmployer,
    verifyOtpByManpower,
    manpowerDocument,
    registrationEmployer,
    sendotpEmployer,
    getUsersByInstantOrDirect,
    viewInShort,
    ViewJobInDdetails,
    viewInShortOfInstantLead,
    generateAndSaveOTP,
    verifyOTPByManpower,
    scheduled_Jobs,
    upadtePostByStatusOfCompletion,
    getCompletedPosts,
    getDataAccToEmployer_Manpower_Agent,
    updateEmployer,
    fillEmployerDetails,
    getDataOfAllEmployerInShort,

    registrationthroughAdmin
} = require("../controller/employerCtrl");

const {verifyToken} = require("../middleware/auth")
const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const upload = multer();


cloudinary.config({
  cloud_name: "dsi1yv3xi",
  api_key: "343572995738873",
  api_secret: "wrcHAy3wkDu8jhv0UHYlMpYmdDQ",
});


router.post("/registrationthroughAdmin",verifyToken,  registrationthroughAdmin);
//////////////////////////////////////////////////////////////////////////////

router.post("/registration/Employer", registrationEmployer);
router.post("/sendotp/Employer", sendotpEmployer);
// router.post("/signup", signupEmployer);
router.post("/login", loginEmployer);
router.post("/verify/otp/:id", verifyOtpEmployer);
router.get("/getAll", getAllEmployer);
router.get("/:id", getAllEmployerById);
router.put("/update/Employer/:id", updateEmployer);
router.put("/update/fillEmployerDetails/:id", fillEmployerDetails);
router.put("/direct/detail/:id", detailDirectEmployer);
router.put("/updatebyManpoweridEmployer", updatebyManpoweridEmployer);
router.put("/updatebyAgentidEmployer", updatebyAgentidEmployer);
router.put("/instant/detail/:id", detailInstantEmployer);
router.get("/getUsersBy/InstantOrDirect/:value", getUsersByInstantOrDirect);
router.get("/get/viewPostInShort",viewInShort)
router.get("/get/ViewJobInDdetails",ViewJobInDdetails)
router.get("/get/viewInShortOfInstantLead",viewInShortOfInstantLead)
router.put("/put/generateAndSaveOTP",generateAndSaveOTP)
router.post("/post/verifyOTPByManpower",verifyOTPByManpower)
router.get("/scheduled/Jobs", scheduled_Jobs);
router.put("/upadtePost/ByStatusOfCompletion/:orderId", upadtePostByStatusOfCompletion);
router.get("/getall/StatusOfCompletion", getCompletedPosts);
router.get("/get/getDataAccToEmployer_Manpower_Agent/:d", getDataAccToEmployer_Manpower_Agent);
router.get("/get/getDataOfAllEmployerInShort", getDataOfAllEmployerInShort)


// router.get("/getInstanOrDirect", getInstanOrDirect);
// router.post("/upload/documents/:id",
//   upload.fields([{ name: "aadharCard" }, { name: "panCard" }]),
//   manpowerDocument
// );

router.post("/verifyOtpByManpower/:manpowerid", verifyOtpByManpower);

module.exports = router;
