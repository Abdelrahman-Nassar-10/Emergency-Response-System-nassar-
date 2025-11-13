const express = require("express");
const router = express.Router();

const Hospital = require("../models/hospitalsModel");

const getAllHospitals = async (req, res, next) => {
  try {
    const hospitals = await Hospital.findAll();
   const geoJSON = {
     type: "FeatureCollection",
     features: hospitals.map((h) => ({
       type: "Feature",
       geometry: { type: "Point", coordinates: [h.longitude, h.latitude] },
       properties: { name_ar: h.name_ar },
     })),
   };

   res.json(geoJSON);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
module.exports={getAllHospitals}