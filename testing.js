// // // require("dotenv").config({
// // //   path: `./.env`,
// // // });
// const sequelize = require("./connection");
// const Courses = require("./modules/Courses");
// const Teachers = require("./modules/Teachers");
// const { v4: uuidv4 } = require("uuid"); //for id
// const Students = require("./modules/Students"); //module users

// const { DataTypes, Model, Sequelize } = require("sequelize");
// let studentCourses = require("./modules/studentCourse");
// const { Op } = require("sequelize");
// const a = async () => {};

// // a();
// const _ = require("lodash");

// const ss = async (req) => {
//   const students = await Courses.findAll({
//     attributes: {
//       exclude: ["id"],
//     },
//     include: {
//       attributes: [],
//       model: Students,
//       where: { id: "9483337e-93b5-4861-9c7e-8d0f4f4c6529" },
//       require: true,
//     },
//     raw: true,
//   });
//   students.forEach((element) => {
//     console.log(_.pick(element, ["name", "cost", "countSession", "createdAt"]));

//     // console.log(element);
//   });
// };

// let oob = {
//   name: "Ryyyy",
//   cost: 30000,
//   costTeacher: 10000,
//   countSession: 15,
//   TeacherID: "ea23b170-b099-4d75-b215-f5739b657053",
// };
// ss(oob);

// /*

// const students = await Courses.findAll({
//         where: { id: req.params.id },
//         attributes: {
//           exclude: ["id"],
//         },
//         include: {
//           attributes: {
//             exclude: ["id"],
//           },
//           model: Students,
//           require: true,
//         },
//         raw: true,
//       });

//         let countStudent1 = await Courses.findAll({
//     attributes: [
//       "id",
//       "name",
//       [sequelize.fn("COUNT", sequelize.col("Students.id")), "Counter"],
//     ],
//     include: {
//       model: Students,
//       required: true,
//     },
//     // ,
//     raw: true,
//     group: "id",
//   });
// */

// Read the person's birth date from the user
let birthDate = "2002-01-21";

// Convert the birth date to a Date object
birthDate = new Date(birthDate);

// Get the current date
let currentDate = new Date();

// Calculate the number of milliseconds between the two dates
let ageInMilliseconds = currentDate - birthDate;

// Calculate the age in years by dividing the number of milliseconds by the number of milliseconds in a year
let ageInYears = ageInMilliseconds / 31536000000;

// Output the result
console.log(`You are ${ageInYears} years old.`);
