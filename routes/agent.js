const express = require("express");
const {
    registrationAgent,
    loginAgent,
    verifyOtpAgent,
    detailDirectAgent,
    getAgentById,
    listOfAllLeadByEmployer,
    detailInstantEmployer,
    getAllEmployer,
    getAllEmployerById,
    updatebyManpoweridEmployer,
    getInstanOrDirect,
    loginWithPhone,
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
    getCompletedPosts
} = require("../controller/agent");
const router = express.Router();


const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dsi1yv3xi",
  api_key: "343572995738873",
  api_secret: "wrcHAy3wkDu8jhv0UHYlMpYmdDQ",
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});
const upload = multer({ storage: storage });
var cpUpload = upload.fields([{ name: 'aadhar', maxCount: 1 }, { name: 'pan', maxCount: 1 }]);



router.post("/registration/Agent", registrationAgent);
// router.post("/sendotp/Employer", sendotpEmployer);
// router.post("/signup", signupEmployer);
router.post("/login/agent", loginAgent);
router.post("/verifyOtp/Agent/:id", verifyOtpAgent);
// router.get("/getAll", getAllEmployer);
router.get("/getAgentById/:agentId", getAgentById);
router.put("/detail/DirectAgent/:id", cpUpload,detailDirectAgent);
router.put("/listOfAllLeadByEmployer", listOfAllLeadByEmployer);
// router.put("/instant/detail/:id", detailInstantEmployer);
// router.get("/getUsersBy/InstantOrDirect/:value", getUsersByInstantOrDirect);
// router.get("/get/viewPostInShort",viewInShort)
// router.get("/get/ViewJobInDdetails",ViewJobInDdetails)
// router.get("/get/viewInShortOfInstantLead",viewInShortOfInstantLead)
// router.put("/put/generateAndSaveOTP",generateAndSaveOTP)
// router.post("/post/verifyOTPByManpower",verifyOTPByManpower)
// router.get("/scheduled/Jobs", scheduled_Jobs);
// router.put("/upadtePost/ByStatusOfCompletion/:orderId", upadtePostByStatusOfCompletion);
// router.get("/getall/StatusOfCompletion", getCompletedPosts);

// // router.get("/getInstanOrDirect", getInstanOrDirect);
// // router.post("/upload/documents/:id",
// //   upload.fields([{ name: "aadharCard" }, { name: "panCard" }]),
// //   manpowerDocument
// // );

// router.post("/verifyOtpByManpower/:manpowerid", verifyOtpByManpower);

module.exports = router;
