//جدول الادوار
const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize"); //المفروض يكون موجود اسم قاعدة البيانات المربوطة معها

class role extends Model {}

role.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, //لايمكن ان يتكرر اسم الدور
      validate: {
        notEmpty: {
          msg: "لايجب ان يكون اسم الدور فارغا",
        },
      },
      set(value) {
        this.setDataValue("name", value.trim()); // تستخدم لازالة الفراغات من بداية ونهاية السلسةtrime, تستخدم لتعيين قيمة محددة لعمود معين في الجدولsetdatavalue
      },
    },

    data: {
      type: DataTypes.JSON, //تستخدم نوع البيانات jsonمن اجل تسهيل عملية البحث عن البيانات
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "role", //تستخدم لتحديد اسم للنموذج
    timestamps: false, //يستخدم لتحديد الوقت والتاريخ في القاعدة او وقت انشاء وتحديث سجل معين
    paranoid: false, //تستخدم لتحسين امان قاعدة البيانات
  }
);
module.exports = role;
