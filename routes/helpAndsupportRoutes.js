const express = require("express");
const { createHelpAndSupport, getHelpAndSupport, getHelpAndSupportById, updateHelpAndSupport ,deleteHelpAndSupport} = require("../controller/helpAndsupportCtrl");
const router = express.Router();

router.post("/add/query", createHelpAndSupport);
router.get("/all/query", getHelpAndSupport);
router.get("/get/query/:id", getHelpAndSupportById);
router.put("/update/query/:id", updateHelpAndSupport);
router.delete("/delete/query/:id", deleteHelpAndSupport);

module.exports = router;
