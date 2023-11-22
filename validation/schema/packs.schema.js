const Joi = require("joi");
module.exports.schema = {
  body: Joi.object({
    name: Joi.string().required().trim(),
    duration: Joi.number().required(),
    price: Joi.number().required(),
  }),
  params: Joi.object({ id: Joi.number().required() }),
  query: {},
};
