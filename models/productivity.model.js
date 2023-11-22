//جدول الحليب
const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize"); //المفروض يكون موجود اسم قاعدة البيانات المربوطة معها

const { enumPeriod } = require("../utils/enum");
class productivity extends Model {}
productivity.init(
    {
        period: {
            type: DataTypes.ENUM,
            values: Object.values(enumPeriod),
            allowNull: false,
            unique: "unique_key",
        },

        amountMilk: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amountFood: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            isDate: true,
            unique: "unique_key",
        },
        animalId: {
            //cow id
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: "unique_key",
        },
    },

    {
        sequelize,
        modelName: "productivity", //تستخدم لتحديد اسم للنموذج
        timestamps: false, //يستخدم لتحديد الوقت والتاريخ في القاعدة او وقت انشاء وتحديث سجل معين
        paranoid: false, //تستخدم لتحسين امان قاعدة البيانات
    }
);

module.exports = productivity;
