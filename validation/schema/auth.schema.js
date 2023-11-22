const Joi = require("joi");
module.exports.schema = {
    //login
    logIn: Joi.object({
        username: Joi.string()
            .trim()
            .pattern(/[a-zA-Z0-9\_\.]+/)
            .min(3)
            .max(30)
            .required(),
        password: Joi.string().required().min(8).max(50),
        tokenDevice: Joi.string().required().trim(),
    }),
};
