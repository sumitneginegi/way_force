const express = require("express");
const router = express.Router();

router.use("/manpower", require("./ManPowerRoutes"));
router.use("/helpp", require("./helpAndsupportRoutes"));
router.use("/employer",require("./employerRoutes"))
router.use("/city",require("./selectcity"))
router.use("/statee",require("./state"))
router.use("/category",require("./categoryROute"))
router.use("/bookingByEmployerr",require("./bookingByEmployer"))
router.use("/paymentt",require("./payment"))


module.exports = router;