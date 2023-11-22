const express = require("express");
const router = new express.Router();

const control = require("../../controllers/role.controller");

const { schema } = require("../../validation/schema/role.schema");

const { validate } = require("../../validation/validation");
const { type } = require("../../validation/typeValidation");
const { auth } = require("../../middleware/auth");
const { access } = require("../../middleware/access");
const { permissions } = require("../../config/permission");

router.post(
    "/add",
    auth,
    access(permissions.MangeSection),
    validate(schema.body, type.body),
    control.add
); //اضافة

router.put(
    "/update/:id",
    auth,
    access(permissions.MangeSection),
    validate(schema.params, type.params),
    validate(schema.body, type.body),
    control.update
);

router.delete(
    "/remove/:id",
    auth,
    access(permissions.MangeSection),
    validate(schema.params, type.params), //حذف
    control.remove
);

router.get("/all", auth, access(permissions.MangeSection), control.getAll);
module.exports = router;
