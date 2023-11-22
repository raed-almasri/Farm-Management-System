const express = require("express");
const router = new express.Router();
router.use("/", require("./home.router"));

router.use("/productivity", require("./productivity.router"));

router.use("/animals", require("./animals.router"));

router.use("/insemination", require("./Insemination.router"));

router.use("/protectVaccines", require("./protectVaccines.router"));

module.exports = router;
