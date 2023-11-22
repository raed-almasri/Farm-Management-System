const _ = require("lodash");
const animals = require("../models/animals.model");
const Insemination = require("../models/Insemination.model");
const { Op } = require("sequelize");
let moment = require("moment");
const { enumGender, enumStatus } = require("../utils/enum");

/*
0 notDonePregnant
1 DonePregnant
null not input yet 

*/
module.exports.add = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);
        const moment = require("moment");

        if (moment(req.body.InseminationDate) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

        let animalDetails = await animals.findOne({
            attributes: ["id", "BirthDate"],
            raw: true,
            where: { id: req.body.animalId, Gender: enumGender.FEMALE },
        });
        if (!animalDetails) throw Error("رقم البقرة غير موجود");

        const now = moment();
        const ageAsMonth = now.diff(animalDetails.BirthDate, "month", true);
        if (
            animalDetails.Status === enumStatus.DRY ||
            animalDetails.Status === enumStatus.PREGNANT
        )
            throw Error(
                `${animalDetails.Status} ان البقرة لا يمكن القاحها بسب انها الان في حالة `
            );
        if (
            await Insemination.findOne({
                raw: true,
                attributes: ["id"],
                where: {
                    animalId: req.body.animalId,
                },
            })
        )
            throw Error("لايمكنك القاح البقرة الحالية بسبب انها ملقحة حاليا");
        if (ageAsMonth < 10)
            throw Error(
                "البقرة صغيرة يجب ان تتجاوز ال10 اشهر حتى يبدا الالقاح"
            );

        if (req.body.InseminationType === true) {
            let InseminatedBullId = await animals.findOne({
                attributes: ["id", "BirthDate"],
                where: {
                    id: req.body.InseminatedBullId,
                    Gender: enumGender.MALE,
                },
            });
            if (!InseminatedBullId) throw Error("رقم العجل غير صحيح");

            const ageAsMonth = now.diff(
                InseminatedBullId.BirthDate,
                "month",
                true
            );
            if (ageAsMonth < 10)
                throw Error(
                    "ان العجل عمره الا يتجاوز ال10 لا يمكنه اجراء عملية الالقاح"
                );
        }
        if (
            await Insemination.findOne({
                attributes: ["id"],
                where: {
                    animalId: req.body.animalId,
                    InseminationDate: moment(req.body.InseminationDate).format(
                        "YYYY-MM-DD"
                    ),
                },
            })
        )
            throw Error("لايمكن اعطاء اللقاح لنفس البقرة مرتين في نفس اليوم");

        if (req.body.InseminationType === true) {
            if (
                !(await animals.findOne({
                    attributes: ["id"],
                    where: {
                        id: req.body.InseminatedBullId,
                        Gender: enumGender.MALE,
                    },
                }))
            )
                throw Error(" رقم العجل غير صحيح");
        }
        let dataNew = await Insemination.create({
            ...req.body,
            state: null,
        });

        res.status(200).send({
            success: true,
            id: dataNew.id,
            msg: "تمت اضافة بنجاح ",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.update = async (req, res) => {
    try {
        req.body = _.omit(req.body, "id");

        const moment = require("moment");
        if (moment(req.body.InseminationDate) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

        let record = await Insemination.findByPk(req.params.id, {
            attributes: ["id"],
        });
        if (!record) throw Error("رقم السجل غير صحيح ");
        let animalDetails = await animals.findOne({
            attributes: ["id", "BirthDate"],
            raw: true,
            where: { id: req.body.animalId, Gender: enumGender.FEMALE },
        });
        if (!animalDetails) throw Error("رقم البقرة غير موجود");

        const now = moment();
        const ageAsMonth = now.diff(animalDetails.BirthDate, "month", true);
        if (
            animalDetails.Status === enumStatus.DRY ||
            animalDetails.Status === enumStatus.PREGNANT
        )
            throw Error(
                `${animalDetails.Status} ان البقرة لا يمكن القاحها بسب انها الان في حالة `
            );
        if (ageAsMonth < 10)
            throw Error(
                "البقرة صغيرة يجب ان تتجاوز ال10 اشهر حتى يبدا الالقاح"
            );

        if (req.body.InseminationType === true) {
            let InseminatedBullId = await animals.findOne({
                attributes: ["id", "BirthDate"],
                where: {
                    id: req.body.InseminatedBullId,
                    Gender: enumGender.MALE,
                },
            });
            if (!InseminatedBullId) throw Error(" رقم العجل غير صحيح");

            const ageAsMonth = now.diff(
                InseminatedBullId.BirthDate,
                "month",
                true
            );
            if (ageAsMonth < 10)
                throw Error(
                    "ان العجل عمره الا يتجاوز ال10 لا يمكنه اجراء عملية الالقاح"
                );
        }

        let b = false;
        if (
            record.InseminationDate !=
            moment(req.body.InseminationDate).format("YYYY-MM-DD")
        ) {
            if (
                await Insemination.findOne({
                    raw: true,
                    attributes: ["id"],
                    where: {
                        animalId: record.id,
                        id: { [Op.not]: req.params.id },
                        InseminationDate: moment(
                            req.body.InseminationDate
                        ).format("YYYY-MM-DD"),
                    },
                })
            )
                throw Error("رقم البقرة والتاريخ موجودين سابقا");
            b = true;
        }
        if (!b) {
            if (
                !(await Insemination.findOne({
                    attributes: ["id"],
                    where: {
                        id: req.params.id,
                        [Op.or]: [
                            {
                                InseminationType: {
                                    [Op.not]: record.InseminationType,
                                },
                            },
                            {
                                InseminatedBullId: {
                                    [Op.not]: req.body.InseminatedBullId,
                                },
                            },
                        ],
                    },
                }))
            )
                throw Error("لايمكن اعطاء اللقاح لنفس البقرة مرتين باليوم");
        }

        await Insemination.update(
            {
                ..._.omit(req.body, "id"),
            },
            { where: { id: req.params.id } }
        );

        res.status(200).send({ success: true, msg: "تمت تعديل بنجاح " });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.delete = async (req, res) => {
    try {
        let InseminationDelete = await Insemination.findOne({
            attributes: ["id", "animalId"],

            where: { id: req.params.id },
        });
        if (!InseminationDelete) throw Error("رقم السجل غير موجود");
        await animals.update(
            { Status: enumStatus.DAIRY },
            { where: { id: InseminationDelete.animalId } }
        );
        await InseminationDelete.destroy({ force: true });
        res.status(200).send({ success: true, msg: "تمت عملية الحذف بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.getAll = async (req, res) => {
    try {
        let data = await Insemination.findAll();
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
};

module.exports.donePregnant = async (req, res) => {
    try {
        const moment = require("moment");
        if (moment(req.body.InseminationDate) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

        let cowInfoInsemination = await Insemination.findOne({
            where: {
                animalId: req.params.id,
                InseminatedBullId: req.query.InseminatedBullId,
                InseminationDate: req.query.InseminationDate,
            },
        });
        if (!cowInfoInsemination)
            throw Error(
                "البيانات المدخلة غير صحيحة الرجاء التاكد من ادخال جميع البيانات بلشكل الصحيح "
            );

        if (cowInfoInsemination.state === true)
            throw Error("تم ادخال حالة الحمل انه تم الحمل سابقا");
        else cowInfoInsemination.state = true;
        await cowInfoInsemination.save();
        await animals.update(
            { Status: enumStatus.PREGNANT },
            { where: { id: req.params.id } }
        );
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
};

// module.exports.notDonePregnant = async (req, res) => {
//     try {
//         const moment = require("moment");
//         if (moment(req.body.InseminationDate) > moment())
//             throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

//         let cowInfoInsemination = await Insemination.findOne({
//             where: {
//                 animalId: req.params.id,
//                 InseminatedBullId: req.query.InseminatedBullId,
//                 InseminationDate: req.query.InseminationDate,
//             },
//         });
//         if (!cowInfoInsemination)
//             throw Error(
//                 "البيانات المدخلة غير صحيحة الرجاء التاكد من ادخال جميع البيانات بلشكل الصحيح "
//             );
//         if (cowInfoInsemination.state === false)
//             throw Error("تم ادخال حالة الحمل انه لم يتم الحمل سابقا");
//         else cowInfoInsemination.state = false;
//         cowInfoInsemination.dateBirth = null;
//         await cowInfoInsemination.save();

//         // console.log(1);
//         res.status(200).send({ success: true });
//     } catch (error) {
//         res.status(500).send({ success: false, error: error.message });
//     }
// };

module.exports.BornCow = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        const moment = require("moment");
        if (moment(req.body.InseminationDate) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");

        if (!req.body.dataBorn)
            throw Error("لا يمكن ترك حقل تاريخ الولادة فارغ");

        let cowInfoInsemination = await Insemination.findOne({
            where: {
                animalId: req.params.id,
                InseminatedBullId: req.query.InseminatedBullId,
                InseminationDate: req.query.InseminationDate,
            },
        });
        if (!cowInfoInsemination)
            throw Error(
                "البيانات المدخلة غير صحيحة الرجاء التاكد من ادخال جميع البيانات بلشكل الصحيح "
            );

        if (cowInfoInsemination.state !== true)
            throw Error(
                "لا يمكنك اجراء عملية الولادة قبل ادخال انه قد تم الحمل "
            );
        if (cowInfoInsemination.dateBirth)
            throw Error("تم ادخال حالة الولادة انه تم الولادة سابقا");
        else cowInfoInsemination.dateBirth = req.body.dataBorn;

        const date1 = moment(
            cowInfoInsemination.InseminationDate,
            "YYYY-MM-DD"
        );
        const date2 = moment();

        const diffMonths = date2.diff(date1, "months", true);
        // console.log(diffMonths);
        if (diffMonths < 8)
            throw Error(
                "لا يمكنك ادخال انها قد تمت الولادة يجب ان يكون مضى على الالقاح 8 اشهر على الاقل"
            );
        await cowInfoInsemination.save();
        await animals.update(
            { Status: enumStatus.DAIRY },
            { where: { id: req.params.id } }
        );
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
};
