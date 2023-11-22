const { Op } = require("sequelize");
const animals = require("../models/animals.model");
const _ = require("lodash");
const Insemination = require("../models/Insemination.model");
const productivity = require("../models/productivity.model");
const { enumGender, enumStatus } = require("../utils/enum");
const MedicalCondition = require("../models/MedicalCondition.model");

module.exports.add = async (req, res) => {
    try {
        const moment = require("moment");
        if (moment(req.body.BirthDate) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");
        if (!req.body.Gender) throw Error("الاجراء ادخال الجنس");

        if (req.body.Gender === enumGender.MALE && req.body.Status)
            throw Error(
                "ادخال خاطئ لا يمكن ان يتم دخال نوع الحيوان ذكر وله حالة"
            );
        if (
            req.body.MotherId !== null &&
            req.body.FatherId === req.body.MotherId
        )
            throw Error("لا يمكن ان يكون رقم الام ورقم الام نفسه ");

        const now = moment();
        const age = now.diff(req.body.BirthDate, "years", true);

        if (
            age < 0.83 &&
            req.body.Gender === enumGender.FEMALE &&
            req.body.Status !== enumStatus.SMALL
        ) {
            throw Error(
                "ادخال خاطئ لا يمكنك ادخال الحالة التالية بسبب ان العمر البقرة صغير الرجاء اختيار صغير للتمكن من عملية الادخال "
            );
        } else if (age > 0.83 && req.body.Status === enumStatus.SMALL)
            throw Error("ادخال خاطئ يجب ان يكون حالة البقرة غير صغير");

        let animal = await animals.findByPk(req.body.id, {
            attributes: ["id"],
        });
        if (animal) throw Error("رقم الحيوان المدخل موجود مسبقا");

        // if (req.body.MotherId !== null && req.body.FatherId !== null) {
        //     if (
        //         !(await Insemination.findOne({
        //             raw: true,
        //             attributes: ["id"],
        //             where: {
        //                 animalId: req.body.MotherId,
        //                 InseminatedBullId: req.body.FatherId,
        //                 dateBirth: { [Op.not]: null },
        //             },
        //         }))
        //     )
        //         throw Error(
        //             "احدى البيانات خاطئة رقم الاب او رقم الام غير صحيح"
        //         );
        // } else if (req.body.MotherId === null && req.body.FatherId === null) {
        // } else {
        //     throw Error(
        //         "لا يمكنك ادخال ادخال رقم الاب وترك رقم الام فارغ او العكس"
        //     );
        // }

        let newAnimal = await animals.create({ ...req.body });
        res.status(200).send({
            success: true,
            data: newAnimal.id,
            msg: "تمت الاضافة بنجاح",
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.update = async (req, res) => {
    try {
        const moment = require("moment");
        if (moment(req.body.BirthDate) > moment())
            throw Error("لا يمكنك ادخال تاريخ اكبر من تاريخ اليوم ");
        if (req.body.Gender) throw Error("ادخال خاطئ لايمكنك ادخال الجنس ");

        const now = moment();
        const age = now.diff(req.body.BirthDate, "years", true);
        if (
            req.body.MotherId !== null &&
            req.body.FatherId === req.body.MotherId
        )
            throw Error("لا يمكن ان يكون رقم الام ورقم الام نفسه ");

        // console.log(age);
        let updateAnimal = await animals.findOne({
            raw: true,
            attributes: ["Gender"],
            where: { id: req.params.id },
        });

        if (!updateAnimal) throw Error("الحيوان غير موجود");
        if (
            age < 0.83 &&
            updateAnimal.Gender == enumGender.FEMALE &&
            req.body.Status !== enumStatus.SMALL
        ) {
            throw Error(
                "ادخال خاطئ لا يمكنك ادخال الحالة التالية بسبب ان العمر البقرة صغير الرجاء اختيار صغير للتمكن من عملية الادخال "
            );
        } else if (
            age > 0.83 &&
            updateAnimal.Gender == enumGender.FEMALE &&
            req.body.Status === enumStatus.SMALL
        )
            throw Error("ادخال خاطئ يجب ان يكون حالة البقرة غير صغير");

        if (updateAnimal.Gender === enumGender.MALE && req.body.Status)
            throw Error(
                "ادخال خاطئ لا يمكن ان يتم دخال نوع الحيوان ذكر وله حالة"
            );

        if (req.params.id != req.body.id)
            if (
                await animals.findOne({
                    where: { id: req.body.id },
                })
            )
                throw Error("رقم الحيوان موجود لحيوان اخر");

        // if (req.body.MotherId !== null && req.body.FatherId !== null) {
        //     if (
        //         !(await Insemination.findOne({
        //             raw: true,
        //             attributes: ["id"],
        //             where: {
        //                 animalId: req.body.MotherId,
        //                 InseminatedBullId: req.body.FatherId,
        //                 dateBirth: { [Op.not]: null },
        //             },
        //         }))
        //     )
        //         throw Error(
        //             "احدى البيانات خاطئة رقم الاب او رقم الام غير صحيح"
        //         );
        // } else if (req.body.MotherId === null && req.body.FatherId === null) {
        // } else {
        //     throw Error(
        //         "لا يمكنك ادخال ادخال رقم الاب وترك رقم الام فارغ او العكس"
        //     );
        // }
        await animals.update({ ...req.body }, { where: { id: req.params.id } });
        res.status(200).send({ success: true, msg: "تمت عملية التحديث بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.getAll = async (req, res) => {
    try {
        let data = await animals.findAll({
            paranoid: false,
            attributes: { exclude: ["deadAt"] },
        });
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.delete = async (req, res) => {
    try {
        let animalDelete = await animals.findByPk(req.params.id, {
            attributes: ["id"],
        });
        if (!animalDelete) throw Error("رقم الحيوان غير موجود");
        await animalDelete.destroy({ force: true });
        res.status(200).send({ success: true, msg: "تمت عملية الحذف بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

// module.exports.disable = async (req, res) => {
//     try {
//         let animalDelete = await animals.findByPk(req.params.id, {
//             attributes: ["id"],
//         });
//         if (!animalDelete) throw Error("رقم الحيوان غير موجود");
//         await animalDelete.destroy({});
//         res.status(200).send({ success: true, msg: "تمت عملية الحذف بنجاح" });
//     } catch (error) {
//         res.status(501).send({ success: false, error: error.message });
//     }
// };

module.exports.search = async (req, res) => {
    try {
        let response = {};
        let animalInformation = await animals.findOne({
            attributes: { exclude: ["deadAt"] },
            where: { id: req.query.animalId },
        });
        if (!animalInformation) throw Error("رقم المدخل غير موجود");

        response.animalInformation = animalInformation;
        let recordsHealth = await MedicalCondition.findAll({
            raw: true,
            where: { animalId: req.query.animalId },
        });
        response.recordsHealth = recordsHealth;

        let recordOfProductivity = [];
        if (animalInformation.Gender === enumGender.FEMALE) {
            recordOfProductivity = await productivity.findAll({
                attributes: { exclude: ["id"] },
                where: { animalId: req.query.animalId },
                raw: true,
            });

            response.recordOfProductivity = recordOfProductivity;
        } else response.recordOfProductivity = [];

        res.status(200).send({
            success: true,
            data: response,
        });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

// module.exports.updateInfoById = async (req, res) => {
//     try {
//         let animalInformation = await animals.findOne({
//             where: { id: req.query.animalId },
//         });
//         if (!animalInformation) throw Error("رقم المدخل غير موجود");

//         res.status(200).send({
//             success: true,
//             data: { animalInformation },
//         });
//     } catch (error) {
//         res.status(501).send({ success: false, error: error.message });
//     }
// };

// module.exports.updateRecordsHealthById = async (req, res) => {
//     try {
//         let response = {};
//         let animalInformation = await animals.findOne({
//             where: { id: req.query.animalId },
//         });
//         if (!animalInformation) throw Error("رقم المدخل غير موجود");

//         let recordsHealth = await MedicalCondition.findAll({
//             raw: true,
//             where: { animalId: req.query.animalId },
//         });
//         response.recordsHealth = recordsHealth;

//         res.status(200).send({
//             success: true,
//             data: response,
//         });
//     } catch (error) {
//         res.status(501).send({ success: false, error: error.message });
//     }
// };

// module.exports.updateRecordOfProductivityById = async (req, res) => {
//     try {
//         let response = {};
//         let animalInformation = await animals.findOne({
//             where: { id: req.query.animalId },
//         });
//         if (!animalInformation) throw Error("رقم المدخل غير موجود");

//         let recordOfProductivity = [];
//         if (animalInformation.Gender === enumGender.FEMALE) {
//             recordOfProductivity = await productivity.findAll({
//                 attributes: { exclude: ["id"] },
//                 where: { animalId: req.query.animalId },
//                 raw: true,
//             });

//             response.recordOfProductivity = recordOfProductivity;
//         } else response.recordOfProductivity = [];

//         res.status(200).send({
//             success: true,
//             data: response,
//         });
//     } catch (error) {
//         res.status(501).send({ success: false, error: error.message });
//     }
// };
