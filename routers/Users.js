const express = require("express");
const router = new express.Router(); //use to route this section
const Auth = require("../middleware/authentication"); //authentication
const {
  create,
  update,
  remove,
  disable,
  //   disableAccount,
} = require("../controllers/Users/Users");

//create user
router.post("/create", create);

//update course
router.patch("/update", Auth, update);

//remove course
router.delete("/delete", Auth, remove);

router.delete("/disable", Auth, disable);
// //filter course
// router.get("/filter/:choose", Auth, filter);

// //get all students in this course
// router.get("/all/:id", Auth, getStudentsOfCourse);

//share with other files
module.exports = router;
