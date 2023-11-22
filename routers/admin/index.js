const express = require("express");
const router = new express.Router();

router.use("/role", require("./role.router"));

router.use("/user", require("./user.router"));

router.use("/medicalCondition", require("./MedicalCondition.router"));

module.exports = router;
