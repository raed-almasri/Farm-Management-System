//جدول الحيوان
const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize");
const moment = require("moment");
const Insemination = require("./Insemination.model");
const { enumGender, enumStatus } = require("../utils/enum");
const productivity = require("./productivity.model");
const MedicalCondition = require("./MedicalCondition.model");
class animals extends Model {}
animals.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: false,
        },
        MotherId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        FatherId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        BirthDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,

            validate: {
                notEmpty: {
                    msg: "birthday not empty",
                },
            },
        },

        Status: {
            type: DataTypes.ENUM, //في حال كان عجل false,في حال كان بقرةtrue
            values: Object.values(enumStatus),
            allowNull: true,
        },
        Gender: {
            type: DataTypes.ENUM, //في حال كان عجل false,في حال كان بقرةtrue
            values: Object.values(enumGender),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Gender not empty",
                },
            },
        },

        Weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deadAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
        sequelize,
        modelName: "animals", //تستخدم لتحديد اسم للنموذج
        timestamps: true, //يستخدم لتحديد الوقت والتاريخ في القاعدة او وقت انشاء وتحديث سجل معين
        updatedAt: false,
        createdAt: false,
        paranoid: true, //تستخدم لتحسين امان قاعدة البيانات
        deletedAt: "deadAt",
        hooks: {
            beforeDestroy: async (animalInfo) => {
                if (animalInfo.Gender === enumGender.FEMALE) {
                    await Insemination.destroy({
                        force: true,
                        where: { animalId: animalInfo.id },
                    });
                    await productivity.destroy({
                        force: true,
                        where: { animalId: animalInfo.id },
                    });
                } else {
                    await Insemination.destroy({
                        force: true,
                        where: { animalId: animalInfo.id },
                    });
                }

                await MedicalCondition.destroy({
                    where: { animalId: animalInfo.id },
                });
            },
        },
    }
);
module.exports = animals;
