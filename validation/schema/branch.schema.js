const Joi = require("joi");
module.exports.schema = {
  body: Joi.object({
    name: Joi.string().required().trim(),
    countryName: Joi.string().required().trim(),
    countClass: Joi.number().required(),
  }),
  params: Joi.object({ id: Joi.number().required() }),
  query: {},
};
