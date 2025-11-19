const express = require("express");
const router = express.Router();
const { createReport, getAllReports } = require("../services/AccidentService");
const verifyToken = require("../middlewares/verifyToken");


router.route("/").post(verifyToken,createReport).get(getAllReports)
module.exports = router;
