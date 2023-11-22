require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class diseases_animal extends Model {}

diseases_animal.init(
  {
    //id of cow
    id_animal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    id_diseases: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
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
    modelName: "diseases_animal", // We need to choose the model name
    timestamp: false,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = diseases_animal;
