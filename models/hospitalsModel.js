const { Sequelize, Op, Model, DataTypes, STRING } = require("sequelize");
const { sequelize } = require("../dataBase/dataBaseConnection.js");
// const User = require("./userModel");

const Hospital = sequelize.define("Hospital", {
  name_ar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
});
module.exports = Hospital;
