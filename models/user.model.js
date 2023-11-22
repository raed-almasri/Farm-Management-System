const sequelize = require("../utils/connect");
const { bcrypt } = require("../utils/bcrypt");
const notification = require("./notification.model");
const { DataTypes, Model } = require("sequelize"); //المفروض يكون موجود اسم قاعدة البيانات المربوطة معها
class user extends Model {}
user.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "لايجب ان يكون حقل الاسم فارغا",
                },
            },
            set(value) {
                this.setDataValue("name", value.trim()); // تستخدم لازالة الفراغات من بداية ونهاية السلسةtrime, تستخدم لتعيين قيمة محددة لعمود معين في الجدولsetdatavalue
            },
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "اسم المستخدم موجود لحساب اخر",
            },

            validate: {
                notEmpty: {
                    msg: "لايجب ان يكون حقل اسم المستخدم فارغا",
                },
            },
            set(value) {
                this.setDataValue("username", value.trim()); // تستخدم لازالة الفراغات من بداية ونهاية السلسةtrime, تستخدم لتعيين قيمة محددة لعمود معين في الجدولsetdatavalue
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "لايجب ان يكون حقلكلمة المرور فارغا",
                },
            },
            set(value) {
                this.setDataValue("password", value.trim()); // تستخدم لازالة الفراغات من بداية ونهاية السلسةtrime, تستخدم لتعيين قيمة محددة لعمود معين في الجدولsetdatavalue
            },
        },
        access_token: {
            type: DataTypes.STRING(450),
            allowNull: true,
        },
        tokenDevice: {
            type: DataTypes.STRING(450),
            allowNull: true,
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "user", //تستخدم لتحديد اسم للنموذج
        timestamps: false, //يستخدم لتحديد الوقت والتاريخ في القاعدة او وقت انشاء وتحديث سجل معين
        paranoid: false, //تستخدم من اجل منع حذف السحل وولكمن يتم تسميته غ محذوف ولم يتم عرضه في حال تم طلب عرض جميع السجلات

        hooks: {
            beforeDestroy: async (userInfo) => {
                await notification.destroy({
                    where: { userId: userInfo.id },
                    force: true,
                });
            },
        },
    }
);
module.exports = user;
