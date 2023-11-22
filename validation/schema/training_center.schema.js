const Joi = require("joi");
module.exports.schema = {
  //login
  //   logIn: Joi.object({
  //     username: Joi.string()
  //       .trim()
  //       .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*$/)
  //       .min(3)
  //       .max(30)
  //       .required(),
  //     password: Joi.string().required().min(8).max(50),
  //   }),
  //   //sign in for normal user
  //   signInUser: Joi.object({
  //     name: Joi.string().required().min(2).max(50).trim(),
  //     gender: Joi.boolean().default(true).required(),
  //     category: Joi.array().items(Joi.string().trim()).required(),
  //     email: Joi.string()
  //       .trim()
  //       .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*(@gmail\.com)$/)
  //       .allow(null),
  //     phoneNumber1: Joi.string()
  //       .trim()
  //       .required()
  //       .pattern(/^(09)(\d{8})$/),
  //     phoneNumber2: Joi.string()
  //       .trim()
  //       .required()
  //       .pattern(/^(09)(\d{8})$/),
  //     birthday: Joi.date().required(),
  //     username: Joi.string()
  //       .trim()
  //       .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*$/)
  //       .min(3)
  //       .max(30)
  //       .required(),
  //     password: Joi.string().required().min(8).max(50),
  //     avatar: Joi.string().allow(null),
  //   }),
  //   //sign in for manger store
  //   signInManger: Joi.object({
  //     //user info
  //     name: Joi.string().required().min(2).max(50).trim(),
  //     motherName: Joi.string().trim().required().min(2).max(50),
  //     fatherName: Joi.string().trim().required().min(2).max(50),
  //     familyName: Joi.string().trim().required().min(2).max(50),
  //     gender: Joi.boolean().required(),
  //     email: Joi.string()
  //       .trim()
  //       .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*(@gmail\.com)$/)
  //       .allow(null),
  //     phoneNumber1: Joi.string()
  //       .trim()
  //       .required()
  //       .pattern(/^(09)(\d{8})$/),
  //     phoneNumber2: Joi.string()
  //       .trim()
  //       .required()
  //       .pattern(/^(09)(\d{8})$/),
  //     username: Joi.string()
  //       .trim()
  //       .pattern(/^[A-Za-z]+[a-zA-Z0-9\_\.]*$/)
  //       .min(3)
  //       .max(30)
  //       .required(),
  //     password: Joi.string().required().min(8).max(50),

  //     //store info
  //     nameStore: Joi.string().required().min(3).max(50).trim(),
  //     longitude: Joi.number().required(),
  //     latitude: Joi.number().required(),
  //     fromHour: Joi.number().required().min(1).max(12),
  //     toHour: Joi.number().required().min(1).max(12),
  //     category: Joi.string().required().trim(),
  //     ssn: Joi.string()
  //       .trim()
  //       .pattern(/^(04010)(\d{6})$/)
  //       .required(),
  //     //بتفق عليهن مع الفرونت
  //     country: Joi.string().required().min(2).max(50).trim(),
  //     constraint: Joi.string().required().min(2).max(50).trim(),
  //     StoreStory: Joi.string().allow(null),
  //     avatar1: Joi.string().allow(null),
  //     avatar2: Joi.string().allow(null),
  //     avatar: Joi.string().allow(null),
  //   }),
  add_Center: Joi.object({
    nameCountry: Joi.string().required().min(2).max(50).trim(),
    nameCenter: Joi.string().required().min(2).max(150).trim(),
    countClass: Joi.number().required().min(1),
    fromHour: Joi.number().required().min(0).max(23),
    toHour: Joi.number().required().min(0).max(23).greater(Joi.ref("fromHour")),

    //manger info
    name: Joi.string().required().min(2).max(50).trim(),
    gender: Joi.boolean().required(),
    email: Joi.string()
      .trim()
      .pattern(/[a-zA-Z]+[a-zA-Z0-9\_\.]*(@gmail\.com)$/)
      .allow(null),
    phoneNumber: Joi.string()
      .trim()
      .required()
      .pattern(/^(09)(\d{8})$/),

    username: Joi.string()
      .trim()
      .pattern(/^[A-Za-z]+[a-zA-Z0-9\_\.]*$/)
      .min(3)
      .max(30)
      .required(),
    password: Joi.string().required().min(8).max(50),
  }),
  update: Joi.object({
    typeTraining: Joi.string().required().min(2).max(50).trim(),
    nameCountry: Joi.string().required().min(2).max(30).trim(),
    nameCenter: Joi.string().required().min(2).max(150).trim(),
    countClass: Joi.number().required().min(1),
    fromHour: Joi.number().required().min(0).max(23),
    toHour: Joi.number().required().min(0).max(23).greater(Joi.ref("fromHour")),
  }),
  params: Joi.object({ id: Joi.number().required() }),
  query: {},
};
