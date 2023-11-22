const express = require("express");
const router = new express.Router();
const control = require("../../controllers/productivity.controllers");
const { type } = require("../../validation/typeValidation");
const { schema } = require("../../validation/schema/productivity.schema");
const { validate } = require("../../validation/validation");
const { access } = require("../../middleware/access");
const { permissions } = require("../../config/permission");

const { auth } = require("../../middleware/auth");

router.post(
    "/add",
    auth,
    access(permissions.ProductionSection),
    validate(schema.body, type.body),
    control.add
);

router.put(
    "/update/:id",
    auth,
    access(permissions.ProductionSection),
    validate(schema.params, type.params),
    validate(schema.body, type.body),
    control.update
);

router.delete(
    "/delete/:id",
    auth,

    access(permissions.ProductionSection),
    validate(schema.params, schema.params),
    control.delete
);

router.get("/all", auth, access(permissions.ProductionSection), control.getAll);
module.exports = router;
