const express = require("express");
const router = express.Router();
const { getAllAmbulances } = require("../services/ambulanceService");
router.route("/").get(getAllAmbulances)

module.exports = router;
