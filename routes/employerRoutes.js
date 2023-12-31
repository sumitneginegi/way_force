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
    sendNotificationToParticularManpowerOrEmployer,
    getPostByEmployerIdAndOrderId,
    getCountOfPostsByEmployerIdAndInstantOrDirect,
    YourProfileUpdateEmployer,
    updateLatAndLong,
    updateWalletForEmployers,
    updateManpowerToken,
    updateEmployerToken,
    updateEmployerLocation,
    getStatusOfOrderId,
    updateCategoryForEmployer
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




const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dn9a9vunu", api_key: "797383573924537", api_secret: "zDdxM3LtLHwX5N8lD_PUGs4Hn_E", });
const storage = new CloudinaryStorage({
        cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
})
const upload = multer({ storage: storage })
var cpUpload = upload.fields([{ name: 'aadhar', maxCount: 1 },{name:'pan',maxCount:1}])
// console.log(cpUpload);



// cloudinary.config({ 
//   cloud_name: 'dll8hqaqn', 
//   api_key: '813184186261365', 
//   api_secret: 'Mo813W_sjpO1c_E1ujytrpyr6qA' 
// });

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
router.put("/update/Employer/:id",cpUpload,updateEmployer);
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
router.post("/findParticularManpowerOrEmployer", sendNotificationToParticularManpowerOrEmployer)
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
router.put("/update/EmployerToken/:employerId", updateEmployerToken);
router.put("/update/EmployerLocation/:id", updateEmployerLocation);
router.get("/get/getStatusOfOrderId", getStatusOfOrderId);
router.put("/update/updateCategoryForEmployer", updateCategoryForEmployer);

module.exports = router;
