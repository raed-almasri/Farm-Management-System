require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class milk extends Model {}

milk.init(
  {
    //id of cow
    id_animal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      primaryKey: true,
      type: DataTypes.DATE,
      isDate: true,
      get() {
        return moment.utc(this.getDataValue("date")).format("YYYY-MM-DD");
      },
    },
    amount_morning: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount_night: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "milk", // We need to choose the model name
    timestamp: true,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = milk;
