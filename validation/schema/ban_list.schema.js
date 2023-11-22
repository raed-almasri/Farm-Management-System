const Joi = require("joi");
module.exports.schema = {
  body: {
    modify: Joi.object({
      reason: Joi.string().required().trim(),
      restrictions: Joi.array().items(Joi.string().trim()).required(),
      duration: Joi.number().required(),
    }),
    blocking: Joi.object({
      userId: Joi.number().required(),
      banListId: Joi.number().required(),
    }),
  },
  params: Joi.object({ id: Joi.number().required() }),
  query: {},
};
