const express = require("express");
const router = new express.Router();

router.use("/auth", require("./auth.router"));

router.use("/farm", require("./farm"));

router.use("/admin", require("./admin"));
router.use("/test", (req, res) => {
    res.send({ success: true, message: "test page " });
});
router.use("/*", (req, res) => {
    res.status(404).send({
        message:
            "هذه الصفحةالمطلوبة غير موجودة  الرجاء التاكد من ادخال المسار بلشكل الصحيح",
    });
});
module.exports = router;
