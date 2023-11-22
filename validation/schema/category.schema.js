const Joi = require("joi");
module.exports.schema = {
  body: Joi.object({ name: Joi.string().required().trim() }),
  params: Joi.object({ id: Joi.number().required() }),
  query: {},
};
