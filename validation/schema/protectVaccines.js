const Joi = require("joi");
const moment = require("moment");
module.exports.schema = {
    body: Joi.object({
        name: Joi.string().required().trim(),
        date: Joi.date()
            .required()
            .max(moment().format("YYYY-MM-DD"))
            .min(moment("1970-02-05").format("YYYY-MM-DD")),
        id: Joi.number().integer().allow(null),
    }),
    params: Joi.object({ id: Joi.number().integer().required() }),
    query: {},
};
