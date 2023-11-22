const Users = require("../../modules/Users/Users"); //module User
const Accounts = require("../../modules/Accounts/Accounts"); //module User
const userInterest = require("../../modules/Users/userInterests");

const moment = require("moment");
const { createInterests, updateInterests } = require("./userInterest"); //module User
const { register, updateAccount } = require("../Accounts");
const _ = require("lodash");
const bcrypt = require("../../utils/bcrypt");

//create
async function create(req, res) {
  try {
    //choose every attribute without  this attributes
    let details = _.omit(req.body, ["password", "username", "id", "Interests"]);
    //! here  check if is valid value before created by joi
    //create and save in database
    let user = await Users.create({ ...details });
    // req.Accounts = { username, password };
    // req.userInterests = { Interests: req.body.Interests };
    // //!create account
    let { account, error } = await register({
      username: req.body.username,
      password: req.body.password,
      userId: user.id,
      typeAccount: "0", //because account user
    });
    if (error) {
      //delete user
      await Users.destroy({ where: { id: user.toJSON().id }, force: true });
      return res.status(404).send({ error });
    }
    //!create interests
    let error2 = await createInterests({
      id: user.toJSON().id,
      Interests: req.body.Interests,
    });
    if (error2) {
      //delete user
      await Users.destroy({ where: { id: user.toJSON().id }, force: true });
      await Accounts.destroy({
        where: { userId: user.toJSON().id },
        force: true,
      });
      return res.status(404).send({ error });
    }
    return res.status(201).send({
      Message: `Successfully add user and create account login ✅`,
      user: user.toJSON(),
      account,
      age: user.getAge(),
    });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
}
//update
async function update(req, res) {
  try {
    if (!(await Users.findByPk(req.body.id)))
      return res.status(400).send({
        error: `id is not for any user `,
      });
    let userBefore = req.user.toJSON();
    let accountBefore = req.account;
    if (!userBefore)
      return res.status(400).send({
        error: `user is not login as user `,
      });
    //choose just this attribute for user
    let details = _.pick(req.body, [
      "name",
      "city",
      "gender",
      "phoneNumber",
      "birthday",
    ]);
    let details2 = _.pick(userBefore, [
      "name",
      "city",
      "gender",
      "phoneNumber",
      "birthday",
    ]);
    //! here  check if is valid value before created by joi
    if (!_.isEqual(details, details2)) {
      await Users.update({ ...details }, { where: { id: req.body.id } });
    }

    // //****************************** */
    if (
      !(
        (await bcrypt.compare(
          req.body.password,
          accountBefore.toJSON().password
        )) && req.body.username === accountBefore.toJSON().username
      )
    ) {
      //   //!update account
      let { account, error } = await updateAccount({
        username: req.body.username,
        password: req.body.password,
        userId: userAfter.toJSON().id,
      });
      //if found error then restore before edit
      if (error) {
        await userBefore.save();
        await accountBefore.save(); //may be error
        return res.status(404).send({ error });
      } else {
        accountBefore = account;
      }
    }

    // //****************************** */
    let userAfter = (await Users.findByPk(req.body.id)).toJSON();
    // console.log(userAfter);
    let userInterestBefore = await userInterest.findAll({
      where: { userId: userAfter.id },
    });
    //!update interests
    let error2 = await updateInterests({
      id: userAfter.id,
      Interests: req.body.Interests,
    });

    if (error2) {
      //restore the data before edited
      await userBefore.save(); //may be error
      await userInterestBefore.save(); //may be error
      await accountBefore.save();
      return res.status(404).send({ error2 });
    }
    return res.status(200).send({
      message: `Successfully update user and account login ✅`,
      user: userAfter,
      account: accountBefore,
    });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
}
//remove
async function remove(req, res) {
  try {
    if (!req.account)
      return res.status(400).send({ message: `user is not available ` });

    //delete user and userInterests and account
    await Users.destroy({
      where: { id: req.user.id },
      force: true,
    });
    return res
      .status(200)
      .send({ message: "successfully deleted user and logout  ✅" });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
}
//disable account
async function disable(req, res) {
  try {
    if (!req.account)
      return res.status(400).send({ message: `user is not available ` });

    await Users.update(
      { disableAt: Date.now() },
      {
        where: { id: req.user.id },
      }
    );
    await Accounts.update(
      { disableAt: Date.now() },
      {
        where: { userId: req.user.id },
      }
    );
    console.log(
      await Users.findAll({ where: { id: req.user.id }, paranoid: false })
    );
    return res
      .status(200)
      .send({ message: "successfully disable user and logout  ✅" });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
}

// //get all courses has this student
// const courseOfStudent = async (req, res) => {
//   if (!(await Students.findByPk(req.params.id)))
//     return res.status(404).send({ message: "id student is not valid " });
//   try {
//     const students = await Courses.findAll({
//       attributes: {
//         exclude: ["id"],
//       },
//       include: {
//         attributes: [],
//         model: Students,
//         where: { id: req.params.id },
//         require: true,
//       },
//       raw: true,
//     });
//     let answer = [];
//     students.forEach((element) => {
//       answer.push(
//         _.pick(element, ["name", "cost", "countSession", "createdAt"])
//       );
//     });
//     return res.status(200).send({ Result: answer });
//   } catch (error) {
//     return res.status(404).send({ Error: error.message });
//   }
// };
module.exports = { create, update, remove, disable };
