const express = require("express");
const router = express.Router();
const Ambulance = require("../models/ambulancesModel");

const getAllAmbulances = async (req, res, next) => {
  try {
    const ambulances = await Ambulance.findAll();
    const geoJSON = {
      type: "FeatureCollection",
      features: ambulances.map((h) => ({
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
module.exports = { getAllAmbulances };
