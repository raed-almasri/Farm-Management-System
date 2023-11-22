const Joi = require("joi");
module.exports.schema = {
  body: {
    usernamePhoneNumber: Joi.object({
      phoneNumber: Joi.string().allow(null).trim(),
      username: Joi.string()
        .trim()
        .pattern(/[a-zA-Z]+[a-zA-Z0-9]*$/)
        .min(3)
        .max(30)
        .allow(null),
    }),
  },
  params: {},
  query: {},
};
