const Joi = require("joi");
module.exports.schema = {
  body: Joi.object({
    nameStore: Joi.string().required().min(3).max(50).trim(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
    fromHour: Joi.number().required().min(1).max(12),
    toHour: Joi.number().required().min(1).max(12),
    category: Joi.string().required(),
    avatar_store: Joi.string().allow(null),
  }),
  params: {
    idJust: Joi.object({ id: Joi.number().required() }),
  },
  query: {},
};
