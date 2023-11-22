const express = require("express");
const router = new express.Router();
const control = require("../../controllers/Insemination.controllers");
const { type } = require("../../validation/typeValidation");
const { schema } = require("../../validation/schema/Insemination.schema");
const { validate } = require("../../validation/validation");
const { auth } = require("../../middleware/auth");

const { access } = require("../../middleware/access");
const { permissions } = require("../../config/permission");
router.post(
    "/add",
    auth,
    access(permissions.surveillanceSection),

    validate(schema.body, type.body),
    control.add
);

router.put(
    "/update/:id",
    auth,
    access(permissions.surveillanceSection),

    validate(schema.params, type.params),
    validate(schema.body, type.body),
    control.update
);

router.delete(
    "/delete/:id",
    auth,
    access(permissions.surveillanceSection),
    validate(schema.params, schema.params),
    control.delete
);

router.get(
    "/all",
    auth,
    access(permissions.surveillanceSection),
    control.getAll
);

router.put(
    "/donePregnant/:id",
    auth,
    access(permissions.surveillanceSection),
    validate(schema.params, type.params),
    validate(schema.query, type.query),
    control.donePregnant
);

router.put(
    "/BornCow/:id",
    auth,
    access(permissions.surveillanceSection),
    validate(schema.params, type.params),
    validate(schema.query, type.query),
    control.BornCow
);

module.exports = router;
