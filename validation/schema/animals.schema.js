const Joi = require("joi");
const moment = require("moment");
const { enumGender, enumStatus } = require("../../utils/enum");
module.exports.schema = {
    body: Joi.object({
        id: Joi.number().integer().allow(null),
        FatherId: Joi.number().integer().allow(null),
        MotherId: Joi.number().integer().allow(null),
        BirthDate: Joi.date()
            .required()
            .max(moment().format("YYYY-MM-DD"))
            .min(moment("1970-02-05").format("YYYY-MM-DD")),
        Status: Joi.string().valid(...Object.values(enumStatus)),

        Gender: Joi.string().valid(...Object.values(enumGender)),
        Weight: Joi.number().required().min(50).max(600),
    }),
    params: Joi.object({ id: Joi.number().required().integer() }),
    query: Joi.object({ animalId: Joi.number().required().integer() }),
};
