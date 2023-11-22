const Courses = require("../modules/Courses"); //module users
const Teachers = require("../modules/Teachers");
const Students = require("../modules/Students"); //module users
let studentCourses = require("../modules/studentCourse");
const { v4: uuidv4 } = require("uuid"); //for id
const { Op } = require("sequelize");
const sequelize = require("../utils/database");
const _ = require("lodash");

//crete
const create = async (req, res) => {
  // console.log("*****************");
  // console.log(req.body);
  try {
    //check  teacher is exists or not
    if (!(await Teachers.findByPk(req.body.TeacherID)))
      return res.status(400).json({
        Error:
          "Teacher Id is not found please try again, and check ID teacher ",
      });
    //check if course and name teacher already exist or name course , then edit name of course
    const checkBefore = await Courses.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { name: req.body.name.trim().toLowerCase() },
              { TeacherID: req.body.TeacherID.trim() },
            ],
          },
          { name: req.body.name.trim().toLowerCase() },
        ],
      },
    });
    if (checkBefore) {
      return res.status(400).json({
        message:
          "This course with this teacher  is already exists or name of course already exists , please change ",
      });
    }
    //end check
    //check if courses is already for other teacher
    const checkCourseBefore = (await Courses.findOne({
      where: {
        name: req.body.name.trim(),
      },
    }))
      ? true
      : false;
    //create new id
    let id = uuidv4();
    //all field expect id
    let details = _.omit(req.body, ["id", "TeacherID"]);
    let teacher = await Teachers.findByPk(req.body.TeacherID);
    //create new course
    let courses = await Courses.create({ id, ...details });
    //set  a teacher
    await teacher.addCourses(courses);
    courses = courses.toJSON();

    courses = _.omit(courses, ["id", "createdAt", "updatedAt", "deletedAt"]);
    if (checkCourseBefore)
      return res.status(200).send({
        Warning: "name course is already exists for other teacher ",
        Message: `Successfully add Courses ✅`,
        Course: courses,
      });
    else
      return res.status(200).send({
        Message: `Successfully add Courses ✅`,
        Course: courses,
      });
  } catch (error) {
    // console.log(error.message);
    return res.status(404).send({ Error: error.message });
  }
};
// //update
const update = async (req, res) => {
  try {
    //check course is exists
    const course = await Courses.findByPk(req.params.id);
    if (!course)
      return res.status(400).send({
        Error: `course ${req.body.name.trim().toLowerCase()} is not defined`,
      });

    //check if teacher is exists or not
    if (!(await Teachers.findByPk(req.body.TeacherID)))
      return res.status(400).json({
        Error:
          "Teacher Id is not found please try again, and check ID teacher ",
      });
    //check if course and name teacher already exist or name course , then edit name of course
    const checkBefore = await Courses.findOne({
      where: {
        [Op.or]: [
          {
            [Op.and]: [
              { name: req.body.name.trim().toLowerCase() },
              { TeacherID: req.body.TeacherID.trim() },
            ],
          },
          { name: req.body.name.trim().toLowerCase() },
        ],
      },
    });
    if (checkBefore) {
      return res.status(400).json({
        message:
          "This course with this teacher  is already exists or name of course already exists , please change ",
      });
    }
    //end check
    //all field except id
    let details = _.omit(req.body, ["id"]);
    await Courses.update({ ...details }, { where: { id: req.params.id } });
    let courses = _.omit(
      (await Courses.findByPk(req.params.id))["dataValues"],
      ["id", "createdAt", "updatedAt", "deletedAt"]
    );
    return res.status(200).send({
      Message: `Successfully Updated course ✅ `,
      Course: courses,
    });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
// //remove
const remove = async (req, res) => {
  try {
    const course = await Courses.findByPk(req.params.id);
    if (!course)
      return res
        .status(400)
        .send({ Error: `course ${req.body.name.trim()} is not exists  ` });

    //out student form the course before deleted
    await studentCourses.destroy({ where: { CourseId: req.params.id } });
    //remove course
    await Courses.destroy({ where: { id: req.params.id } });
    return res.status(200).send({ Result: "successfully deleted course ✅" });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
//filter
const filter = async (req, res) => {
  let types = ["teacher", "course", "cost", "subject", "date", "student"];
  if (!types.includes(req.body.type))
    return res.status(404).send({ message: "wrong type field " });
  try {
    const choose = req.params.choose;
    switch (req.body.type) {
      case "course":
        if (choose >= 0 && choose <= 2) {
          switch (choose) {
            case "0":
              //don't done course , is active now
              let courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { done: false },
              });
              let ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({
                courses: ans,
              }); ///teacher: await courses.getTeacher().toJSON() });
              break;
            case "1":
              //done course m is finished
              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { done: true },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });
              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "2":
              //every course ,all
              courses = await Courses.findAll({});
              return res.status(200).send({ courses }); ///teacher: await courses.getTeacher().toJSON() });
          }
        } else
          return res.status(404).send({ Error: "the Number is not valid" });
        break;
      case "cost":
        if (choose >= 0 && choose <= 3) {
          switch (choose) {
            case "0":
              // greater than
              let courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { cost: { [Op.gte]: req.body.number } },
              });
              let ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ courses: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "1":
              //little then  course
              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { cost: { [Op.lte]: req.body.number } },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "2":
              //equal number course

              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { cost: req.body.number },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "3":
              //between  course

              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { cost: { [Op.between]: [req.body.min, req.body.max] } },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
          }
        } else
          return res.status(404).send({ Error: "the Number is not valid" });

        break;
      case "subject":
        let courses = await Courses.findAll({
          include: {
            model: Teachers,
            attributes: ["name", "phoneNumbers"],
          },
          raw: true,
          require: true,
          where: { name: req.body.courseName },
        });
        let ans = [];
        courses.forEach((c) => {
          ans.push(
            _.pick(c, [
              "name",
              "costTeacher",
              "countSession",
              "Teacher.name",
              "Teacher.phoneNumbers",
            ])
          );
        });

        return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });

        break;
      case "date":
        if (choose >= 0 && choose <= 3) {
          switch (choose) {
            case "0":
              let courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { startDate: { [Op.gte]: req.body.date } },
              });
              let ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "1":
              //done course
              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { startDate: { [Op.lte]: req.body.date } },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "2":
              //every course

              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: { startDate: req.body.date },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
            case "3":
              //between  course

              courses = await Courses.findAll({
                include: {
                  model: Teachers,
                  attributes: ["name", "phoneNumbers"],
                },
                raw: true,
                require: true,
                where: {
                  startDate: {
                    [Op.between]: [req.body.startDate, req.body.endDate],
                  },
                },
              });
              ans = [];
              courses.forEach((c) => {
                ans.push(
                  _.pick(c, [
                    "name",
                    "costTeacher",
                    "countSession",
                    "Teacher.name",
                    "Teacher.phoneNumbers",
                  ])
                );
              });

              return res.status(200).send({ course: ans }); ///teacher: await courses.getTeacher().toJSON() });
          }
        } else
          return res.status(404).send({ Error: "the Number is not valid" });

        break;
      case "student":
        if (choose >= 0 && choose <= 3) {
          let courseWithCount = await Courses.findAll({
            attributes: [
              "id",
              "name",
              [sequelize.fn("COUNT", sequelize.col("Students.id")), "count"],
            ],
            include: {
              model: Students,
              required: true,
            },
            raw: true,
            group: "id",
          });
          let answer = [];
          switch (choose) {
            case "0":
              answer = [];
              //show every course with number students inner it
              courseWithCount.forEach((e) => {
                answer.push(_.pick(e, ["name", "count"]));
              });
              return res.status(200).send({ courses: answer });
            case "1":
              answer = [];
              courseWithCount.forEach((e) => {
                if (e.count <= req.body.number)
                  answer.push(_.pick(e, ["name", "count"]));
              });
              return res.status(200).send({ courses: answer });
            case "2":
              // show very course has above the number
              answer = [];
              courseWithCount.forEach((e) => {
                if (e.count >= req.body.number)
                  answer.push(_.pick(e, ["name", "count"]));
              });
              return res.status(200).send({ courses: answer });
            case "3":
              //between  course
              answer = [];
              courseWithCount.forEach((e) => {
                if (e.count >= req.body.min && e.count <= req.body.max)
                  answer.push(_.pick(e, ["name", "count"]));
              });
              return res.status(200).send({ courses: answer });
          }
        } else
          return res.status(404).send({ Error: "the Number is not valid" });

        break;
    }
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};
//get all students of this course
const getStudentsOfCourse = async (req, res) => {
  try {
    if (!(await Courses.findByPk(req.params.id)))
      return res.status(404).send({ Error: "id course is not valid " });
    const students = await Students.findAll({
      attributes: {
        exclude: ["id"],
      },
      include: {
        attributes: [],
        model: Courses,
        where: { id: req.params.id },
        require: true,
      },
      raw: true,
    });
    let answer = [];
    students.forEach((element) => {
      answer.push(_.pick(element, ["name", "level", "phoneNumbers", "gender"]));
    });
    return res.status(200).send({ Students: answer });
  } catch (error) {
    return res.status(404).send({ Error: error.message });
  }
};

module.exports = {
  create,
  update,
  remove,
  filter,
  getStudentsOfCourse,
};
