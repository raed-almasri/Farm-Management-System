const Joi = require("joi");

//date
let date = new Date(Date.now());
// console.log(date);
let dayOfThisMonth = new Date(
  date.getFullYear(),
  date.getMonth() + 1,
  0
).getDate();
let day = date.getDate();
let month = date.getMonth() + 1;
// console.log(month);

let year = date.getFullYear();
let dateValidMin = null;
let dateValidMax = null;
if (2 + day <= dayOfThisMonth) day += 2;
else {
  if (month + 1 > 12) {
    year++;
    month = 1;
    // console.log("year", year, "month", month);
  } else month++;
  // console.log(day, dayOfThisMonth);
  day = day - dayOfThisMonth + 2;
}

dateValidMin = year + "-" + month + "-" + day;
dateValidMax = year + 1 + "-" + month + "-" + day;

module.exports.schema = {
  body: Joi.object({
    title: Joi.string().required().min(2).max(100),
    discount: Joi.number().required().min(1).max(99),
    cost: Joi.number().required(),
    description: Joi.string().required(),
    avatars: Joi.any().allow(null),
    //this date is after two day
    endDate: Joi.date().min(dateValidMin).max(dateValidMax).required(),
  }),
  params: {
    idJust: Joi.object({ id: Joi.number().required() }),
  },
  query: {},
};
