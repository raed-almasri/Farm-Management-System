const Joi = require("joi");
const { allPermission } = require("../../utils/helper");
module.exports.schema = {
    body: Joi.object({
        //name of role
        name: Joi.string().required().trim(),

        show: Joi.array().items(Joi.string().required()).required().min(1),
        permission: Joi.array()
            .items(
                Joi.string()
                    .custom((value, helpers) => {
                        if (!allPermission.includes(value))
                            return helpers.message(
                                "القيمة المدخلة غير مطابقة لصلاحيات المركز"
                            );
                        else return value;
                    })
                    .required()
            )
            .required()
            .min(1),
    }),
    params: Joi.object({
        id: Joi.number().integer().min(1).required(),
    }),
    query: {},
};
