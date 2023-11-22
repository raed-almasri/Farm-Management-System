require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class vaccines extends Model {}

vaccines.init(
  {
    id_animal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeVaccines: {
      type: DataTypes.BOOLEAN,
      //1 هوي مخصب
      //0 غير مخصب
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      //1 هوي مخصب
      //0 غير مخصب
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "vaccines", // We need to choose the model name
    timestamp: true,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = vaccines;
