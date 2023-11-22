require("dotenv").config({
    path: `../.env`,
});
const bcrypt = require("bcryptjs");

module.exports.bcrypt = async (password) => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
};

module.exports.compare = async (password, validPassword) =>
    await bcrypt.compare(password, validPassword);
