//جدول اللقاحات الوقائية
const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize");
const moment = require("momment");
class protectvaccines extends Model {}

protectvaccines.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: "unique_key",

            validate: {
                notEmpty: {
                    msg: "لايجب ان يكون حقل الاسم فارغا",
                },
            },
            set(value) {
                this.setDataValue("name", value.trim()); // تستخدم لازالة الفراغات من بداية ونهاية السلسةtrime, تستخدم لتعيين قيمة محددة لعمود معين في الجدولsetdatavalue
            },
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
            unique: "unique_key",

            validate: {
                notEmpty: {
                    msg: "date not empty",
                },
            },
        },
    },

    {
        sequelize,
        modelName: "protectvaccines", //تستخدم لتحديد اسم للنموذج
        timestamps: false, //يستخدم لتحديد الوقت والتاريخ في القاعدة او وقت انشاء وتحديث سجل معين
    }
);
module.exports = protectvaccines;
