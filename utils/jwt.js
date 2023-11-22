const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "../.env",
});
const moment = require("moment");

module.exports.verifyToken = (token) =>
  jwt.verify(token, process.env.SECRET_KEY);

module.exports.createToken = (req, payload) =>
  jwt.sign(
    {
      ...payload,
      ipAddress: req.ip,
      startTime: new Date(),
      expiresAt: moment().add(90, "days").calendar(),
    },
    process.env.SECRET_KEY
  );

module.exports.checkTokenValidity = (token) => {
  const now = Date.now();
  if (now > token.expiresAt)
    // توكن منتهي الصلاحية
    return false;

  // توكن ساري المفعول
  return true;
};
