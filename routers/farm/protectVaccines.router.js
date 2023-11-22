const express = require("express");
const router = new express.Router();
const control = require("../../controllers/protectVaccines.controllers");
const { type } = require("../../validation/typeValidation");
const { schema } = require("../../validation/schema/protectVaccines");
const { validate } = require("../../validation/validation");
const { auth } = require("../../middleware/auth");
const { access } = require("../../middleware/access");
const { permissions } = require("../../config/permission");

router.post(
    "/add",
    auth,
    access(permissions.healthCareSection),
    validate(schema.body, type.body),
    control.add
);

router.put(
    "/update/:id",
    auth,
    access(permissions.healthCareSection),
    validate(schema.params, type.params),
    validate(schema.body, type.body),
    control.update
);

router.delete(
    "/delete/:id",
    auth,
    access(permissions.healthCareSection),
    validate(schema.params, schema.params),
    control.delete
);

router.get("/all", auth, access(permissions.healthCareSection), control.getAll);
module.exports = router;
