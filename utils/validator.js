const Joi = require("joi");

const userCreate = (req, res, next) => {};

const schemaAccounts = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

  repeat_password: Joi.ref("password"),

  access_token: [Joi.string(), Joi.number()],

  birth_year: Joi.number().integer().min(1900).max(2013),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const schemasUser = Joi.object({
  createOrUpdate: {
    id: Joi.number().required(),
    name: Joi.string().required(),
    city: Joi.string().required(),
    gender: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
    birthday: Joi.date().optional(),
  },
  delete: {
    id: Joi.number().required(),
  },
});

// const getSchema = (type) => {
//   switch (type) {
//     case "register": {
//       return Joi.object().keys({
//         name: Joi.string().required(),
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//       });
//     }
//     case "login": {
//       return Joi.object().keys({
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//       });
//     }
//     default: {
//       return null;
//     }
//   }
// };

// module.exports = (type) => (req, res, next) => {
//   const schema = getSchema(type);
//   if (schema) {
//     const result = schema.validate(req.body);
//     if (result.error) {
//       const { details } = result.error;
//       const message = details[0].message.replace(/"|'/g, "");
//       return res.status(400).json({
//         error: message,
//       });
//     }
//     next();
//   } else return new Error("some attribute is not valid ");
// };
