const express = require("express");
const router = express.Router();

router.use("/manpower", require("./ManPowerRoutes"));
router.use("/manpower", require("./helpAndsupportRoutes"));
router.use("/employer",require("./employerRoutes"))
router.use("/city",require("./selectcity"))
router.use("/statee",require("./state"))
router.use("/category",require("./categoryROute"))


module.exports = router;