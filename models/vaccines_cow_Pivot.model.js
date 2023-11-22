require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class vaccines_Pivot_cow extends Model {}

vaccines_Pivot_cow.init(
  {
    id_vaccines: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_cow: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    date_take: {
      type: DataTypes.DATE,
      allowNull: false,
      isDate: true,
      get() {
        return moment.utc(this.getDataValue("date_take")).format("YYYY-MM-DD");
      },
    },
    pollinationSeason: {
      type: DataTypes.ENUM({
        values: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      }),
      allowNull: false,
    },
    state: {
      type: DataTypes.BOOLEAN,
      ///1  حملت
      //0 ما حملت
      allowNull: true,
    },
    date_dought: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "vaccines_Pivot_cow", // We need to choose the model name
    timestamp: true,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = vaccines_Pivot_cow;
