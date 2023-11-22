const { Op } = require("sequelize");
const protectVaccines = require("../models/protectVaccines.model");
const _ = require("lodash");
module.exports.add = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        const moment = require("moment");
        if (moment(req.body.date) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

        let ans = await protectVaccines.findOne({
            where: { name: req.body.name.trim(), date: req.body.date },
        });
        if (ans) throw Error("لايجب أخذ نفس اللقاح مرتين باليوم");

        let newRecord = await protectVaccines.create({
            name: req.body.name.trim(),
            date: req.body.date,
        });
        res.status(200).send({
            success: true,
            data: newRecord.id,
            msg: "تمت اضافة بنجاح ",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.delete = async (req, res) => {
    try {
        let vaccineDelete = await protectVaccines.findByPk(req.params.id);
        if (!vaccineDelete) throw Error("اللقاح غير موجود");
        await vaccineDelete.destroy({ force: true });
        res.status(200).send({ success: true, msg: "تمت عملية الحذف بنجاح" });
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

        let updateVaccines = await protectVaccines.findByPk(req.params.id);
        if (!updateVaccines) throw Error("القاح غير موجود");

        if (
            await protectVaccines.findOne({
                where: {
                    name: req.body.name.trim(),
                    date: req.body.date,
                    id: { [Op.not]: req.params.id },
                },
            })
        )
            throw Error("هذا اللقاح موجود مسبقا");
        await protectVaccines.update(
            { ...req.body },
            { where: { id: req.params.id } }
        );
        res.status(200).send({ success: true, msg: "تمت عملية التحديث بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.getAll = async (req, res) => {
    try {
        let data = await protectVaccines.findAll({});
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
