const express = require("express");
const router = express.Router();
const { getAllHospitals } = require("../services/hospitalService");

router.route("/").get(getAllHospitals);

module.exports = router;