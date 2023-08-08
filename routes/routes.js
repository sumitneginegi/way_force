const express = require("express");
const router = express.Router();

router.use("/manpower", require("./ManPowerRoutes"));
router.use("/helpp", require("./helpAndsupportRoutes"));
router.use("/employer",require("./employerRoutes"))
router.use("/agentt",require("./agent"))
router.use("/city",require("./selectcity"))
router.use("/statee",require("./state"))
router.use("/category",require("./categoryROute"))
router.use("/bookingByEmployerr",require("./bookingByEmployer"))
router.use("/paymentt",require("./payment"))
router.use("/OfferModell",require("./coupencode"))
router.use("/termss",require("./admin/termsAndCondition"))

//////////////////////////////////////////////////

router.use("/adminn",require("./admin/dashboard"))
router.use("/postVerificationn",require("./admin/postVerification"))


module.exports = router;