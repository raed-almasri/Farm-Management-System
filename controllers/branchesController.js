const Employees = require("../modules/Employees"); //module users
const Branches = require("../modules/Branches"); //module users
const Courses = require("../modules/Courses"); //module users
let studentCourses = require("../modules/studentCourse");
const { v4: uuidv4 } = require("uuid"); //for id
const { Op } = require("sequelize");
const sequelize = require("../utils/database");
const _ = require("lodash");
//create without create new user
const create = async (req, res) => {
  try {
    //check for employee
    let employeeTest = await Employees.findOne({
      where: {
        name: req.body.name.trim(),
      },
    });
    if (employeeTest)
      return res.status(400).send({
        Error: ` ${req.body.name.trim()} is already in the list`,
      });
    let id = uuidv4(); //create new id
    //all field expect id
    let details = _.omit(req.body, ["id"]);
    let employee = (await Employees.create({ id, ...details })).toJSON();

    //show message
    employee = _.omit(employee, ["id", "createdAt", "updatedAt", "deletedAt"]);
    res.status(200).send({
      Message: `Successfully add employee ✅`,
      employee,
    });
  } catch (error) {
    res.status(404).send({ Error: error.message });
  }
};
//update done
const update = async (req, res) => {
  try {
    const employee = await Employees.findByPk(req.params.id);
    if (!employee)
      return res.status(400).send({
        Error: `  ${req.params.id} is not in list `,
      });

    let details = _.omit(req.body, ["id"]);
    await Employees.update({ ...details }, { where: { id: req.params.id } });
    let employee_Updated = (await Employees.findByPk(req.params.id)).toJSON();
    employee_Updated = _.omit(employee_Updated, [
      "id",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
    res.status(200).send({
      Message: `Successfully Updated teacher ✅ `,
      Teacher: employee_Updated,
    });
  } catch (error) {
    res.status(404).send({ Error: error.message });
  }
};
//remove done
const remove = async (req, res) => {
  try {
    const employee = await Employees.findByPk(req.params.id);
    if (!employee)
      res.status(400).send({ Error: `employee is not available ` });
    await Employees.destroy({ where: { id: req.params.id } });
    res.status(200).send({ Result: "successfully deleted employee ✅" });
  } catch (error) {
    res.status(404).send({ Error: error.message });
  }
};

//filter don't work
const filter = async (req, res) => {
  // let types = ["teacher", "course", "cost", "subject", "date", "student"];
  // if (!types.includes(req.body.type))
  //   return res.status(404).send({ message: "wrong type field " });
  // try {
  //   const choose = req.params.choose;
  //   switch (req.body.type) {
  //     case "course":
  //       switch (choose) {
  //         case "0":
  //           //don't done course
  //           let teacher = await Employees.findAll({
  //             where: { done: false },
  //           });
  //           return res.status(200).send({ teacher }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "1":
  //           //done course
  //           let teacher2 = await Employees.findAll({
  //             where: { done: true },
  //           });
  //           return res.status(200).send({ teacher: teacher2 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "2":
  //           //every course
  //           let teacher3 = await Employees.findAll({});
  //           return res.status(200).send({ teacher: teacher3 }); ///teacher: await courses.getTeacher().toJSON() });
  //       }
  //       break;
  //     case "cost":
  //       switch (choose) {
  //         case "0":
  //           //don't done course
  //           let teacher = await Employees.findAll({
  //             where: { cost: { [Op.gte]: req.body.number } },
  //           });
  //           return res.status(200).send({ teacher }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "1":
  //           //done course
  //           let teacher2 = await Employees.findAll({
  //             where: { cost: { [Op.lte]: req.body.number } },
  //           });
  //           return res.status(200).send({ teacher: teacher2 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "2":
  //           //every course
  //           let teacher3 = await Employees.findAll({
  //             where: { cost: req.body.number },
  //           });
  //           return res.status(200).send({ teacher: teacher3 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "3":
  //           //between  course
  //           let teacher4 = await Employees.findAll({
  //             where: { cost: { [Op.between]: [req.body.min, req.body.max] } },
  //           });
  //           return res.status(200).send({ teacher: teacher4 }); ///teacher: await courses.getTeacher().toJSON() });
  //       }
  //       break;
  //     case "subject":
  //       let teacher = await Employees.findAll({
  //         where: { name: req.body.teacherName },
  //       });
  //       return res.status(200).send({ teacher }); ///teacher: await courses.getTeacher().toJSON() });
  //       break;
  //     case "date":
  //       switch (choose) {
  //         case "0":
  //           //don't done course
  //           let teacher = await Employees.findAll({
  //             where: { startDate: { [Op.gte]: req.body.date } },
  //           });
  //           return res.status(200).send({ teacher }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "1":
  //           //done course
  //           let teacher2 = await Employees.findAll({
  //             where: { startDate: { [Op.lte]: req.body.date } },
  //           });
  //           return res.status(200).send({ teacher: teacher2 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "2":
  //           //every course
  //           let teacher3 = await Employees.findAll({
  //             where: { startDate: req.body.date },
  //           });
  //           return res.status(200).send({ teacher: teacher3 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "3":
  //           //between  course
  //           let teacher4 = await Employees.findAll({
  //             where: {
  //               startDate: {
  //                 [Op.between]: [req.body.startDate, req.body.endDate],
  //               },
  //             },
  //           });
  //           return res.status(200).send({ teacher: teacher4 }); ///teacher: await courses.getTeacher().toJSON() });
  //       }
  //       break;
  //     case "student":
  //       switch (choose) {
  //         case "0":
  //           //show every course with number students inner it
  //           let countStudent = await studentCourses.findAll({
  //             // attributes: [
  //             //   "CourseId",
  //             //   [sequelize.fn("COUNT", sequelize.col("StudentId")), "count"],
  //             // ],
  //             // group: "CourseId",
  //             include: Courses,
  //             // Students,
  //             raw: true,
  //           });
  //           // countStudent = countStudent.rows;
  //           return res.status(200).send({ "count student": countStudent }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "1":
  //           let countStudent2 = await studentCourses.findAndCountAll({
  //             attributes: [
  //               "CourseId",
  //               [sequelize.fn("COUNT", sequelize.col("StudentId")), "count"],
  //             ],
  //             group: "CourseId",
  //             raw: true,
  //           });
  //           countStudent2 = countStudent2.rows;
  //           let ans = [];
  //           countStudent2.forEach((e) => {
  //             if (e.count <= req.body.number) ans.push(e);
  //           });
  //           return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "2":
  //           let countStudent1 = await studentCourses.findAndCountAll({
  //             attributes: [
  //               "CourseId",
  //               [sequelize.fn("COUNT", sequelize.col("StudentId")), "count"],
  //             ],
  //             group: "CourseId",
  //             raw: true,
  //           });
  //           countStudent1 = countStudent1.rows;
  //           let ans1 = [];
  //           countStudent1.forEach((e) => {
  //             if (e.count >= req.body.number) ans1.push(e);
  //           });
  //           return res.status(200).send({ course: ans1 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "3":
  //           let countStudent11 = await studentCourses.findAndCountAll({
  //             attributes: [
  //               "CourseId",
  //               [sequelize.fn("COUNT", sequelize.col("StudentId")), "count"],
  //             ],
  //             group: "CourseId",
  //             raw: true,
  //           });
  //           countStudent11 = countStudent11.rows;
  //           let ans11 = [];
  //           //between  course
  //           countStudent11.forEach((e) => {
  //             if (e.count >= req.body.min && e.count <= req.body.max)
  //               ans11.push(e);
  //           });
  //           return res.status(200).send({ course: ans11 }); ///teacher: await courses.getTeacher().toJSON() });
  //         case "4":
  //           let countStudent22 = await studentCourses.findAndCountAll({
  //             attributes: [
  //               "CourseId",
  //               [sequelize.fn("COUNT", sequelize.col("StudentId")), "count"],
  //             ],
  //             group: "CourseId",
  //             raw: true,
  //           });
  //           countStudent22 = countStudent22.rows;
  //           let ans12 = [];
  //           //between  course
  //           countStudent22.forEach((e) => {
  //             if (e.count === req.body.number) ans12.push(e);
  //           });
  //           return res.status(200).send({ course: ans12 }); ///teacher: await courses.getTeacher().toJSON() });
  //       }
  //       break;
  //   }
  // } catch (error) {
  //   return res.status(404).send({ Error: error.message });
  // }
};
module.exports = { create, update, remove, filter };

//! note every dynamic parameter should write at the end because if write at the first then is not can reach to other router
