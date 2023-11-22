const express = require("express");
const router = new express.Router(); //use to route this section
const Auth = require("../middleware/authentication"); //authentication
const { register, login, logout } = require("../controllers/Accounts");

// //register user
// router.post("/register", register);

//login user
router.get("/login", login);
//logout
router.get("/logout", Auth, logout);
module.exports = router;
