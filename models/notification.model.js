//جدول الاشعارات

const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize");
const { enumNotification } = require("../utils/enum");
class notification extends Model {}

notification.init(
    {
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "لايجب ان يكون حقل الرسالة فارغ",
                },
            },
            set(value) {
                this.setDataValue("title", value.trim());
            },
        },
        message: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "لايجب ان يكون حقل الرسالة فارغ",
                },
            },
            set(value) {
                this.setDataValue("message", value.trim());
            },
        },
        type: {
            type: DataTypes.ENUM,
            values: Object.values(enumNotification),
            allowNull: false,
        },
        state: { type: DataTypes.BOOLEAN, allowNull: false },
    },

    {
        sequelize,
        modelName: "notification",
        timestamps: true,
        updatedAt: false,
    }
);

module.exports = notification;
