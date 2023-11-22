const express = require("express");
const router = new express.Router(); //use to route this section
const control = require("../controllers/user.controller");
router.post("/add", control.add);
router.put("/update/:id", control.update);
router.delete("/remove/:id", control.remove);

module.exports = router;
