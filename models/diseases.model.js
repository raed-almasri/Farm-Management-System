require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class diseases extends Model {}

diseases.init(
  {
    name: {
      type: DataTypes.STRING(150),
      notEmpty: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "name can't be empty here ",
        },
      },
      set(value) {
        this.setDataValue("name", value.trim());
      },
    },
    nameTreatment: {
      type: DataTypes.STRING(150),
      notEmpty: true,
      allowNull: false,

      set(value) {
        this.setDataValue("nameTreatment", value.trim());
      },
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "diseases", // We need to choose the model name
    timestamp: true,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = diseases;
