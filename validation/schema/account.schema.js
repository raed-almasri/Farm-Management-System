const Joi = require("joi");
module.exports.schema = {
  body: {
    update: Joi.object({
      name: Joi.string().required().min(2).max(50).trim(),
      gender: Joi.boolean().default(true).required(),
      email: Joi.string()
        .trim()
        .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*(@gmail\.com)$/)
        .allow(null),
      phoneNumber1: Joi.string()
        .trim()
        .required()
        .pattern(/^(09)(\d{8})$/),
      phoneNumber2: Joi.string()
        .trim()
        .required()
        .pattern(/^(09)(\d{8})$/),
      birthday: Joi.date().required(),
      username: Joi.string()
        .trim()
        .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*$/)
        .min(3)
        .max(30)
        .required(),
      password: Joi.string().required().min(8).max(50),
      category: Joi.array().items(Joi.string().trim()),
      avatar: Joi.string().allow(null),
    }),
    //disable or delete or check if user here
    category: Joi.object({
      //array of the category
      category: Joi.array().items(Joi.string().trim()).required(),
    }),
    changeEmail: Joi.object({
      email: Joi.string()
        .trim()
        .pattern(/[a-zA-Z]+[a-zA-Z0-9_]*(@gmail\.com)$/)
        .allow(null),
    }),
    changePhone: Joi.object({
      phoneNumber: Joi.string()
        .trim()
        .required()
        .pattern(/^(09)(\d{8})$/),
    }),
    changePassword: Joi.object({
      password: Joi.string().required().min(8).max(50),
      newPassword: Joi.string().required().min(8).max(50),
    }),
  },
};
