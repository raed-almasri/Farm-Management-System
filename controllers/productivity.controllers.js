const productivity = require("../models/productivity.model");
const _ = require("lodash");
const animals = require("../models/animals.model");
const { Op } = require("sequelize");
const { enumGender, enumPeriod } = require("../utils/enum");

module.exports.add = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        const moment = require("moment");

        if (moment(req.body.date) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

        if (
            !(await animals.findOne({
                where: { id: req.body.animalId, Gender: enumGender.FEMALE },
            }))
        )
            throw Error("رقم البقرة غير صحيح");

        let ans = await productivity.findOne({
            where: {
                period: req.body.period,
                date: req.body.date,
                animalId: req.body.animalId,
            },
        });
        if (ans) throw Error("لايجب ان يتم حلب البقرة بنفس الفترة ");

        if (
            req.body.period === enumPeriod.EVENING &&
            req.body.date === moment().format("YYYY-MM-DD")
        ) {
            if (moment().hour() < 20)
                throw Error(
                    "لا يمكنك اجراء عملية الاضافة المسائية لبعد الساعة 8 المساء "
                );
        } else if (
            req.body.period === enumPeriod.MORNING &&
            req.body.date === moment().format("YYYY-MM-DD")
        ) {
            if (moment().hour() < 8)
                throw Error(
                    "لا يمكنك اضافة حالة انتاية قبل الساعة الثامنة صباحا"
                );
        }

        let newRecord = await productivity.create({
            ...req.body,
            animalId: req.body.animalId,
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
        let productivityDelete = await productivity.findByPk(req.params.id);
        if (!productivityDelete) throw Error("رقم السجل غير موجود");
        await productivityDelete.destroy({ force: true });
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

        let record = await productivity.findByPk(req.params.id, {
            attributes: ["date"],
        });
        if (!record) throw Error("رقم السجل غير صحيح");

        if (
            !(await animals.findOne({
                attributes: ["id"],
                where: { id: req.body.animalId },
            }))
        )
            throw Error("رقم الحيوان غير صحيح");

        let ans = await productivity.findOne({
            attributes: ["id"],
            where: {
                period: req.body.period,
                date: req.body.date,
                animalId: req.body.animalId,
                id: { [Op.not]: req.params.id },
            },
        });
        if (ans) throw Error("السجل موجد سابقا");

        if (
            req.body.period === enumPeriod.EVENING &&
            req.body.date === moment().format("YYYY-MM-DD")
        ) {
            if (moment().hour() < 20)
                throw Error(
                    "لا يمكنك اجراء عملية الاضافة المسائية لبعد الساعة 8 المساء "
                );
        } else if (
            req.body.period === enumPeriod.MORNING &&
            req.body.date === moment().format("YYYY-MM-DD")
        ) {
            if (moment().hour() < 8)
                throw Error(
                    "لا يمكنك اضافة حالة انتاية قبل الساعة الثامنة صباحا"
                );
        }

        await productivity.update(
            { ...req.body },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).send({ success: true, msg: "تمت عملية التحديث بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.getAll = async (req, res) => {
    try {
        let data = await productivity.findAll();
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
