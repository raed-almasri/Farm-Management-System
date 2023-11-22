const user = require("../models/user.model");
//utils folder
const { createToken } = require("../utils/jwt");
const { StatusCodes } = require("http-status-codes");
const { compare } = require("../utils/bcrypt");

const moment = require("moment");
const role = require("../models/role.model");

require("../models/relations");

//* login
module.exports.login = async (req, res) => {
    try {
        const myInfo = await user.findOne({
            where: { username: req.body.username.trim() },
            include: { model: role, attributes: ["name", "data"] },
        });

        //if not found user like this username
        if (!myInfo) throw Error("اسم المستخدم غير صحيح");

        if (req.body.password !== myInfo.password)
            throw Error("كلمة المرور غير صحيحة ");
        const token = createToken(req, {
            username: req.body.username.trim(),
        });

        await user.update(
            { access_token: token, tokenDevice: req.body.tokenDevice },
            { where: { username: req.body.username.trim() } }
        );

        res.status(StatusCodes.OK).send({
            success: true,
            data: {
                token,
                role: myInfo.role.name,
                nameUser: myInfo.name,
                permission: JSON.parse(myInfo.role.data),
            },
        });
    } catch (error) {
        //throw error to user
        return res
            .status(StatusCodes.BAD_REQUEST)
            .send({ success: false, error: error.message });
    }
};

//* logout
module.exports.logout = async (req, res) => {
    try {
        if (!req.user.access_token) throw Error("تم تسجيل الخروج مسبقا");
        // delete the access token from the user table
        let a = await user.update(
            { access_token: null, tokenDevice: null },
            { where: { id: req.user.id } }
        );
        res.status(StatusCodes.OK).send({
            success: true,
            msg: "تم تسجيل الخروج بنجاح ",
        });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).send({
            success: false,
            error: error.message,
        });
    }
};
