const user = require("../models/user.model");
const { op } = require("sequelize");
const _ = require("lodash");
const role = require("../models/role.model");
const { bcrypt, compare } = require("../utils/bcrypt");
const notification = require("../models/notification.model");
require("../models/relations");

module.exports.add = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        let myUser = await user.findOne({
            where: { username: req.body.username.trim() },
        });
        if (myUser) throw Error("اسم المستخدم موجود سابقا");

        let myRole = await role.findOne({
            where: { name: req.body.nameRole.trim() },
        });
        if (!myRole) throw Error("اسم الصلاحية غير صحيح");

        let response = await user.create({
            ...req.body,

            roleId: myRole.id,
        });

        res.status(200).send({
            success: true,
            data: response.id,
            msg: "تمت اضافة المستخدم بنجاح",
        });
    } catch (error) {
        res.status(501).send({
            success: false,
            error: error.message,
        });
    }
};
module.exports.update = async (req, res) => {
    try {
        req.body = _.omit(req.body, ["id"]);

        if (req.params.id == 1)
            throw Error("لا يمكنك التعديل على حساب المدير الاساسي");

        let myUser = await user.findByPk(req.params.id);
        if (!myUser) throw error("الرقم غير صحيح");
        let myRole = await role.findOne({
            where: { name: req.body.nameRole.trim() },
        });
        if (!myRole) throw Error("اسم الصلاحية غير صحيح ");

        await user.update(
            {
                ...req.body,
                roleId: myRole.id,
            },
            { where: { id: req.params.id } }
        );

        res.status(200).send({ success: true, msg: "تمت التحديث بنجاح" });
    } catch (error) {
        res.status(200).send({ success: true, error: error.message });
    }
};
module.exports.delete = async (req, res) => {
    try {
        if (req.params.id == 1)
            throw Error("لا يمكنك التعديل على حساب المدير الاساسي");

        let myUser = await user.findByPk(req.params.id);
        if (!myUser) throw Error("رقم المستخدم غير صحيح");
        await myUser.destroy({ force: true });
        res.status(200).send({ success: true, msg: "تمت عملية الحذف بنجاح" });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
module.exports.getAll = async (req, res) => {
    try {
        let data = await user.findAll({
            attributes: ["id", "name", "username", "password"],
            // attributes: { exclude: ["id", "access_token", "roleId"] },
            include: { model: role, attributes: ["name"] },
        });
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};

module.exports.getNotification = async (req, res) => {
    try {
        let { page, size } = req.query;
        await notification.update(
            { state: true },
            {
                offset: (+page - 1) * +size,
                limit: +size,
                where: { userId: req.user.id },
            }
        );
        let data = await notification.findAll({
            limit: +size,
            offset: (+page - 1) * +size,
            where: { userId: req.user.id },
        });
        res.status(200).send({ success: true, data });
    } catch (error) {
        res.status(501).send({ success: false, error: error.message });
    }
};
