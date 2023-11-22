require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class protective_Vaccine extends Model {}

protective_Vaccine.init({
  name: {
    type: DataTypes.STRING(150),
    notEmpty: true,
    validate: {
      notEmpty: {
        msg: "name can't be empty here ",
      },
    },
    set(value) {
      this.setDataValue("name", value.trim());
    },
  },

  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: "protective_Vaccine", // We need to choose the model name
  timestamp: false,
  paranoid: false, //to set the delateAt and mean disable account
});

module.exports = protective_Vaccine;
