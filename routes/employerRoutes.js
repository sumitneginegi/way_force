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
    getPostsByEmployerId,
    sendotpEmployerLogin,

    registrationthroughAdmin,
    findManpowerthroughRadius,
    getPostByEmployerIdAndOrderId,
    getCountOfPostsByEmployerIdAndInstantOrDirect,
    YourProfileUpdateEmployer,
    updateLatAndLong,
    updateWalletForEmployers,
    updateManpowerToken,
    updateEmployerLocation
} = require("../controller/employerCtrl");

const router = express.Router();

const verifyToken = require("../middleware/auth");

// Define allowed roles for a specific API
const allowedRoles1 = ["admin", "subadmin", "employer"];
const allowedRoles2 = ["admin", "subadmin", "manpower"];
const allowedRoles3 = ["admin", "subadmin", "agent"];
const allowedRoles4 = ["admin", "subadmin"];
const allowedRoles5 = ["admin"];

// // Use the middleware with the specific set of allowed roles
// app.get("/api/specific-endpoint", verifyToken(allowedRolesForSpecificAPI), (req, res) => {
//   // Your API logic here
// });




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


router.post("/registrationthroughAdmin",verifyToken.verifyToken(allowedRoles4),  registrationthroughAdmin);
//////////////////////////////////////////////////////////////////////////////

router.post("/registration/Employer", registrationEmployer);
router.post("/sendotp/Employer", sendotpEmployer);
// router.post("/signup", signupEmployer);
router.post("/login", loginEmployer);
router.post("/sendotpEmployerLogin", sendotpEmployerLogin);
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
router.get("/get/getPostsByEmployerId/:id", getPostsByEmployerId)


router.post("/findManpower", findManpowerthroughRadius)
router.get("/getPostByEmployerId/OrderId", getPostByEmployerIdAndOrderId)
router.get("/getCountOfPostsByEmployerId/InstantOrDirect", getCountOfPostsByEmployerIdAndInstantOrDirect)

router.put("/profileEmployer/:id", upload.fields([{ name: "profile", maxCount: 1 },]), YourProfileUpdateEmployer);
router.put("/update/LatAndLong/:orderId", updateLatAndLong);

// router.get("/getInstanOrDirect", getInstanOrDirect);
// router.post("/upload/documents/:id",
//   upload.fields([{ name: "aadharCard" }, { name: "panCard" }]),
//   manpowerDocument
// );

router.post("/verifyOtpByManpower/:manpowerid", verifyOtpByManpower);
router.put("/updateWalletForEmployers", updateWalletForEmployers);
router.put("/update/ManpowerToken/:manpowerId", updateManpowerToken);
router.put("/update/EmployerLocation/:id", updateEmployerLocation);

module.exports = router;
