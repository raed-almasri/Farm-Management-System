const { type } = require("../validation/typeValidation");
const { validate } = require("../validation/validation");
const control = require("../controllers/auth.controllers");
const router = require("express").Router();
const { schema } = require("../validation/Schema/auth.schema");
const { auth } = require("../middleware/auth");

router.post("/login", validate(schema.logIn, type.body), control.login);

router.put("/logout", auth, control.logout);

module.exports = router;
