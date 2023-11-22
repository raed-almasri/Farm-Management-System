const { Op } = require("sequelize");
const MedicalCondition = require("../models/MedicalCondition.model");
const _ = require("lodash");
const animals = require("../models/animals.model");

module.exports.add = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        const moment = require("moment");
        if (moment(req.body.date) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");
        let ans1 = await MedicalCondition.findOne({
            attributes: ["id"],
            where: {
                ...req.body,
            },
        });
        if (ans1) throw Error("السجل موجودة سابقا");

        let checkAnimal = await animals.findOne({
            where: { id: req.body.animalId },
        });
        if (checkAnimal == null) throw Error("رقم الحيوان المدخل غير صحيح ");
        let newRecord = await MedicalCondition.create({ ...req.body });

        res.status(200).send({
            success: true,
            data: newRecord.id,
            msg: "تمت اضافة بنجاح ",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.update = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        const moment = require("moment");
        if (moment(req.body.date) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");
        let ans = await MedicalCondition.findByPk(req.params.id);

        if (!ans) throw Error("  رقم السجل غير صحيح");

        let ans1 = await MedicalCondition.findOne({
            attributes: ["id"],
            where: {
                ...req.body,
                id: { [Op.not]: req.params.id },
            },
        });
        if (ans1) throw Error("السجل موجودة سابقا");

        let checkAnimal = await animals.findOne({
            where: { id: req.body.animalId },
        });
        if (checkAnimal == null) throw Error("رقم الحيوان المدخل غير صحيح ");

        await MedicalCondition.update(
            {
                ...req.body,
            },
            {
                where: { id: req.params.id },
            }
        );

        res.status(200).send({ success: true, msg: "تمت التعديل بنجاح " });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.delete = async (req, res) => {
    try {
        let medicalConditionDelete = await MedicalCondition.findByPk(
            req.params.id
        );
        if (!medicalConditionDelete) throw Error("رقم السجل غير موجود");
        await medicalConditionDelete.destroy({ force: true });
        res.status(200).send({ success: true, msg: "تمت عملية الحذف بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.getAll = async (req, res) => {
    try {
        let data = await MedicalCondition.findAll();
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
