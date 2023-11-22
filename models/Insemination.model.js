//جدول اللقاحات

const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize"); //المفروض يكون موجود اسم قاعدة البيانات المربوطة معها
const moment = require("moment");
class Insemination extends Model {}

Insemination.init(
    {
        animalId: {
            //رقم البقرة
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "unique_value",
        },
        InseminationDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            unique: "unique_value",
        },
        InseminatedBullId: {
            //رقم العجل
            type: DataTypes.INTEGER,
            allowNull: false, //لايسمح بان يكون رقم الحيوان فارغ
        },
        InseminationType: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        state: {
            type: DataTypes.BOOLEAN, //في حال لم يصبح حمل false,في حال اصبح حمل  true
            allowNull: true,
        },
        dateBirth: { type: DataTypes.DATEONLY, allowNull: true }, //تاريخ الولادة الفعلي
    },
    {
        sequelize,
        modelName: "Insemination", //تستخدم لتحديد اسم للنموذج
        timestamps: false, //يستخدم لتحديد الوقت والتاريخ في القاعدة او وقت انشاء وتحديث سجل معين
        paranoid: false, //تستخدم لتحسين امان قاعدة البيانات
    }
);

module.exports = Insemination;
