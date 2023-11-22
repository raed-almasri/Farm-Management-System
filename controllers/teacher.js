const Teachers = require("../modules/teachers"); //module users
const { v4: uuidv4 } = require("uuid"); //for id
const _ = require("lodash");

//crete
const create = async (req, res) => {
  try {
    const teacherTest = await Teachers.findOne({
      where: {
        name: req.body.name.trim(),
      },
    });
    if (teacherTest)
      return res.status(400).send({
        Error: `Teacher ${req.body.name.trim()} is already in the list`,
      });
    let id = uuidv4();

    //all field expect id
    let details = _.omit(req.body, ["id"]);
    let teacher = (await Teachers.create({ id, ...details }))["dataValues"];
    teacher = _.omit(teacher, ["id", "createdAt", "updatedAt", "deletedAt"]);
    res
      .status(200)
      .send({ Message: `Successfully add teacher ✅`, Teacher: teacher });
  } catch (error) {
    res.status(404).send({ Error: error.message });
  }
};
//update
const update = async (req, res) => {
  try {
    const teacher = await Teachers.findByPk(req.params.id);
    if (!teacher)
      return res.status(400).send({
        Error: `teacher ${req.body.name.trim()} is not defined`,
      });

    let details = _.omit(req.body, ["id"]);
    await Teachers.update({ ...details }, { where: { id: req.params.id } });
    let teacher_Updated = (await Teachers.findByPk(req.params.id))[
      "dataValues"
    ];
    teacher_Updated = _.omit(teacher_Updated, [
      "id",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
    res.status(200).send({
      Message: `Successfully Updated teacher ✅ `,
      Teacher: teacher_Updated,
    });
  } catch (error) {
    res.status(404).send({ Error: error.message });
  }
};
//remove
const remove = async (req, res) => {
  try {
    const teacher = await Teachers.findByPk(req.params.id);
    if (!teacher) res.status(400).send({ Error: `teacher is not available ` });
    await Teachers.destroy({ where: { id: req.params.id } });
    res.status(200).send({ Result: "successfully deleted teacher ✅" });
  } catch (error) {
    res.status(404).send({ Error: error.message });
  }
};
module.exports = { create, update, remove };
