const express = require("express");
const router = new express.Router();
const control = require("../../controllers/user.controller");
const { type } = require("../../validation/typeValidation");
const { schema } = require("../../validation/schema/user.schema");
const { validate } = require("../../validation/validation");

const { auth } = require("../../middleware/auth");
const { permissions } = require("../../config/permission");
const { access } = require("../../middleware/access");

router.post(
    "/add",
    auth,
    access(permissions.MangeSection),
    validate(schema.body, type.body),
    control.add
);

router.put(
    "/update/:id",
    auth,
    access(permissions.MangeSection),
    validate(schema.body, type.body),
    validate(schema.params, type.params),
    control.update
);

router.delete(
    "/delete/:id",
    auth,

    access(permissions.MangeSection),
    validate(schema.params, schema.params),
    control.delete
);

router.get("/all", auth, access(permissions.MangeSection), control.getAll);

router.get(
    "/allNotification",
    auth,
    validate(schema.query, schema.query),
    control.getNotification
);
module.exports = router;
