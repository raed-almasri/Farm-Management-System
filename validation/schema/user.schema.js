const Joi = require("joi");

module.exports.schema = {
    body: Joi.object({
        name: Joi.string().required().trim(),
        username: Joi.string()
            .required()
            .trim()
            .pattern(/[a-zA-Z]+[a-zA-Z0-9\.\_]*$/)
            .min(3),
        password: Joi.string().required().min(8),
        id: Joi.number().integer().allow(null),

        nameRole: Joi.string().required().trim(),
    }),
    params: Joi.object({
        id: Joi.number().integer().required().precision(0),
    }),
    query: Joi.object({
        page: Joi.number().integer().required().min(1).max(1e3),
        size: Joi.number().integer().required().min(1).max(1e3),
    }),
};
