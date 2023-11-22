const express = require("express");
const router = new express.Router();
const control = require("../../controllers/animals.controllers");
const { type } = require("../../validation/typeValidation");
const { schema } = require("../../validation/schema/animals.schema");
const { validate } = require("../../validation/validation");
const { access } = require("../../middleware/access");
const { permissions } = require("../../config/permission");
const { auth } = require("../../middleware/auth");

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

router.get(
    "/search",
    auth,
    access(permissions.surveillanceSection),
    validate(schema.query, schema.query),
    control.search
);

module.exports = router;
