const Role = require("../models/role.model");
const _ = require("lodash");
const { Op } = require("sequelize");
const diseases = require("../models/diseases.model");
module.exports.add = async (req, res) => {
  try {
    if (
      await diseases.findOne({
        where: { name: req.body.name },
      })
    )
      throw Error("اسم المرض موجود من قبل ");

    await diseases.create({ ...req.body });

    res.status(200).send({ success: true, msg: "تمت اضافة بنجاح " });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
};
module.exports.remove = async (req, res) => {
  try {
    ///validate
    let role = await diseases.findOne({ where: { id: req.params.id } });
    if (!role) throw Error("رقم غير صحيح ");

    await role.destroy({ force: true });
    res.status(200).send({ success: true, msg: "تمت عميةالحذف بنجاح " });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
};
module.exports.update = async (req, res) => {
  try {
    //validate
    let diseases1 = await diseases.findByPk(req.params.id);
    if (!diseases1) throw Error("رقم غير صحيح ");

    if (
      await diseases.findOne({
        where: { name: req.body.name.trim(), id: { [Op.not]: req.params.id } },
      })
    )
      throw Error("اسم المرض موجود سابقا");

    await diseases.update({ ...req.body }, { id: req.params.id });

    res.status(200).send({ success: true, msg: "تمت عميةالتحديث بنجاح " });
  } catch (error) {
    res.status(404).send({ success: false, error: error.message });
  }
};
//new
module.exports.getAll = async (req, res) => {
  try {
    let all = await role.findAll({
      attributes: ["username", "password", "name"],
    });
    res.status(200).send({ success: true, data: all });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
};
