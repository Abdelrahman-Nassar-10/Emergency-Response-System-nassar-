const express = require("express");
const router = express.Router();
const { createReport, getAllReports } = require("../services/AccidentService");


router.route("/").post(createReport).get(getAllReports)
module.exports = router;
