const control = require("../../controllers/home.controller");
const router = require("express").Router();
const { auth } = require("../../middleware/auth");

const { access } = require("../../middleware/access");
const { permissions } = require("../../config/permission");

router.get("/home/count", auth, access(permissions.HomePage), control.getCount);
router.get(
    "/home/countCalfWithAge",
    auth,
    access(permissions.HomePage),
    control.getCalfWithAge
);
router.get(
    "/home/classificationGender",
    auth,
    access(permissions.HomePage),
    control.GetClassificationGender
);
router.get(
    "/home/classificationCow",
    auth,
    access(permissions.HomePage),
    control.getClassificationCow
);

module.exports = router;
