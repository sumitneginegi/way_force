const express = require("express");
const { AddQuery, getAllQuery, updateQuery, deleteQuery } = require("../controller/helpAndsupportCtrl");
const router = express.Router();

router.post("/add/query", AddQuery);
router.get("/all/query", getAllQuery);
router.put("/update/query", updateQuery);
router.delete("/delete/query", deleteQuery);

module.exports = router;
