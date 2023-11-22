require("dotenv").config({
  // path: "../.env",
}); //use to deal with the environment variables
var Sequelize = require("sequelize");
//connect with database
let sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST,
    operatorsAliases: "false",
    logging: false,
  }
);
module.exports = sequelize;
