//جدول المرض
const sequelize = require("../utils/connect");
const { DataTypes, Model } = require("sequelize"); //المفروض يكون موجود اسم قاعدة البيانات المربوطة معها

class MedicalCondition extends Model {}

MedicalCondition.init(
    {
        animalId: { type: DataTypes.INTEGER, allowNull: false },

        disease: {
            type: DataTypes.STRING,
            allowNull: false,

            set(value) {
                this.setDataValue("disease", value.trim());
            },
        },
        treatment: {
            type: DataTypes.STRING,
            allowNull: false,

            set(value) {
                this.setDataValue("treatment", value.trim());
            },
        },
        date: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
        sequelize,
        modelName: "MedicalCondition",
        timestamps: false,
        paranoid: false,
    }
);

module.exports = MedicalCondition;
