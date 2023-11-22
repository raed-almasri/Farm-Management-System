require("dotenv").config({
    path: `../.env`,
});
const user = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
//very important to include
require("../models/relations");
const { verifyToken } = require("../utils/jwt");
const role = require("../models/role.model");

module.exports.auth = async (req, res, next) => {
    try {
        let rawToken = null;
        const token = req.headers.authorization;
        if (!token) throw Error("wrong token..! please try again");

        if (token.startsWith("Bearer "))
            rawToken = token.replace("Bearer ", "");
        else rawToken = token;

        let decoded = verifyToken(rawToken);
        if (!decoded || !decoded.username)
            throw Error("wrong token..! please try again ");

        const userInfo = await user.findOne({
            attributes: {
                exclude: ["createdAt", "updatedAt", "name", "gender", "roleId"],
            },
            include: {
                model: role,
                attributes: { exclude: ["createdAt", "updatedAt"] },
            },
            where: {
                username: decoded.username.trim(),
                access_token: rawToken,
            },
        });

        if (!userInfo)
            throw Error(
                "JWT is not valid ,Please set the right token and try again"
            );

        req.user = userInfo;
        req.role = req.user.role.dataValues;

        next();
    } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            error: err.message,
        });
    }
};
