require("dotenv").config({
  path: `../.env`,
});
const sequelize = require("../utils/database"); //use to connect with database
const { DataTypes, Model } = require("sequelize");

class treatment extends Model {
  //on hold
  getInterests() {}
}

treatment.init(
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
    id_diseases: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "animal", // We need to choose the model name
    timestamp: treatment,
    paranoid: false, //to set the delateAt and mean disable account
  }
);

module.exports = treatment;
