const Students = require("../modules/Students"); //module users
const Courses = require("../modules/Courses"); //module Courses
const studentCourses = require("../modules/studentCourse"); //module studentCourse
const { v4: uuidv4 } = require("uuid"); //for id
const _ = require("lodash");

//crete
const create = async (req, res) => {
  try {
    const studentTest = await Students.findOne({
      where: {
        name: req.body.name.trim(),
      },
    });
    if (studentTest)
      return res.status(400).send({
        Error: `Student ${req.body.name.trim()} is already in the list`,
      });
    let id = uuidv4();
    //all field expect id
    let details = _.omit(req.body, ["id"]);
    let student = (await Students.create({ id, ...details })).toJSON();
    student = _.omit(student, ["id", "createdAt", "updatedAt", "deletedAt"]);
    return res
      .status(200)
      .send({ Message: `Successfully add students ✅`, Student: student });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
//update
const update = async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id);
    if (!student)
      return res.status(400).send({
        Error: `Student ${req.body.name.trim()} is not defined`,
      });
    let details = _.pick(req.body, ["name", "level", "phoneNumbers", "gender"]);
    await Students.update({ ...details }, { where: { id: req.params.id } });
    let student_Updated = (await Students.findByPk(req.params.id))[
      "dataValues"
    ];
    student_Updated = _.omit(student_Updated, [
      "id",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
    return res.status(200).send({
      Message: `Successfully Updated students ✅ `,
      Student: student_Updated,
    });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
//remove
const remove = async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id);
    if (!student)
      return res.status(400).send({ Error: `Students is not available ` });
    await Students.destroy({ where: { id: req.params.id } });
    return res.status(200).send({ Result: "successfully deleted student ✅" });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
//one join and many join
const join = async (req, res) => {
  //many join
  if (Array.isArray(req.body.StudentId)) {
    for (let i = 0; i < req.body.StudentId.length; i++) {
      try {
        let StudentId = req.body.StudentId[i];
        let student = { CourseId: req.body.CourseId, StudentId };
        //check if valid id
        if (
          (await Students.findByPk(student.StudentId)) &&
          (await Courses.findByPk(student.CourseId))
        ) {
          // console.log(student.StudentId, "    ", student.CourseId);
          //if student is already in the Course
          if (
            await studentCourses.findOne({
              where: {
                StudentId: student.StudentId,
                CourseId: student.CourseId,
              },
            })
          ) {
            // console.log(1);
            return res
              .status(404)
              .send({ MessageError: "student already joined in  course " });
          }

          //add student to course
          await studentCourses.create({ ...student });
          // await studentCourses.addCourses(courses);
          // return res.status(200).send({ Message: "Successfully Joined ✅" });
        } else {
          // return "someThings error ID student or ID course ";
          return res
            .status(404)
            .send({ MessageError: "something error ID student or ID course " });
        }
      } catch (error) {
        // throw new Error(error.message);
        // return error.message;
        return res.status(404).send({ Error: error.message });
      }
      ///************************************************ */
    }
    return res
      .status(200)
      .send({ message: " successfully Joined all students ✔✅🎉" });
  } else {
    ///once join
    try {
      let student = req.body;
      //check if valid id
      if (
        (await Students.findByPk(student.StudentId)) &&
        (await Courses.findByPk(student.CourseId))
      ) {
        // console.log(student.StudentId, "    ", student.CourseId);
        //if student is already in the Course
        if (
          await studentCourses.findOne({
            where: {
              StudentId: student.StudentId,
              CourseId: student.CourseId,
            },
          })
        ) {
          // console.log(1);
          return res
            .status(404)
            .send({ MessageError: "student already joined in  course " });
        }

        //add student to course
        await studentCourses.create({ ...student });
        return res.status(200).send({ Message: "Successfully Joined ✅" });
      } else {
        // return "someThings error ID student or ID course ";
        return res
          .status(404)
          .send({ MessageError: "something error ID student or ID course " });
      }
    } catch (error) {
      return res.status(404).send({ Error: error.message });
    }
  }
};
//get all courses has this student
const courseOfStudent = async (req, res) => {
  if (!(await Students.findByPk(req.params.id)))
    return res.status(404).send({ message: "id student is not valid " });
  try {
    const students = await Courses.findAll({
      attributes: {
        exclude: ["id"],
      },
      include: {
        attributes: [],
        model: Students,
        where: { id: req.params.id },
        require: true,
      },
      raw: true,
    });
    let answer = [];
    students.forEach((element) => {
      answer.push(
        _.pick(element, ["name", "cost", "countSession", "createdAt"])
      );
    });
    return res.status(200).send({ Result: answer });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
module.exports = { create, update, remove, join, courseOfStudent };
