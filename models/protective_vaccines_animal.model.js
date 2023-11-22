require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class protective_vaccines_animal extends Model {}

protective_vaccines_animal.init(
  {
    //id of cow
    id_animal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_protective_vaccines: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    //التاريخ والوقت
    date: {
      primaryKey: true,
      type: DataTypes.DATE,
      isDate: true,
      get() {
        return moment.utc(this.getDataValue("date")).format("YYYY-MM-DD");
      },
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "protective_vaccines_animal", // We need to choose the model name
    timestamp: false,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = protective_vaccines_animal;
