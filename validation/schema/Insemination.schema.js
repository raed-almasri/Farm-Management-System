const Joi = require("joi");
const moment = require("moment");
module.exports.schema = {
    body: Joi.object({
        animalId: Joi.number().integer().required(),
        InseminationDate: Joi.date()
            .required()
            .min(moment("1970-02-05").format("YYYY-MM-DD"))
            .max(moment().format("YYYY-MM-DD")),
        id: Joi.number().integer().allow(null),

        InseminatedBullId: Joi.number().integer().required(),
        InseminationType: Joi.boolean().required(),
    }),
    params: Joi.object({ id: Joi.number().integer().required() }),
    query: Joi.object({
        InseminationDate: Joi.date()
            .required()
            .min(moment("1970-02-05").format("YYYY-MM-DD"))
            .max(moment().format("YYYY-MM-DD")),
        InseminatedBullId: Joi.number().integer().required(),
    }),
};
