const Joi = require("joi");
const { enumPeriod } = require("../../utils/enum");
const moment = require("moment");
module.exports.schema = {
    body: Joi.object({
        period: Joi.string()
            .valid(...Object.values(enumPeriod))
            .required(),
        amountFood: Joi.number().required().min(5).max(60),
        amountMilk: Joi.number().required().min(10).max(100),
        id: Joi.number().integer().allow(null),

        date: Joi.date()
            .required()
            .max(moment().format("YYYY-MM-DD"))
            .min(moment("1970-02-05").format("YYYY-MM-DD")),
        animalId: Joi.number().integer().required(),
    }),
    params: Joi.object({ id: Joi.number().integer().required() }),
    query: {},
};
