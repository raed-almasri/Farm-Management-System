const Accounts = require("../modules/Accounts/Accounts"); //module users
//utils folder
const { createToken } = require("../utils/jwt");
const { compare } = require("../utils/bcrypt");
const _ = require("lodash");
const { Op } = require("sequelize");
//register
async function register(body) {
  try {
    //if account is already registered in website
    if (
      await Accounts.findOne({
        where: { username: body.username },
      })
    ) {
      return { message: "username  already registered " };
    }
    //if account is disable
    if (
      await Accounts.findOne({
        where: { username: body.username },
        paranoid: false,
      })
    ) {
      return { message: "account is disabled you can re Active account ...." };
    }

    //create new token
    const access_token = createToken(body.username);
    const myAccount = await Accounts.create({
      ...body,
      access_token,
    }); //register new user
    let accountNew = _.omit(myAccount.toJSON(), [
      "accountId",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
    return { account: accountNew };
  } catch (error) {
    return { error: error.message };
  }
}
// //deleteAccountFunction
// async function deleteAccount(body) {
//   try {
//     // console.log(body);
//     const ans = await Accounts.findOne({
//       where: { username: body.username },
//     });
//     if (ans) {
//       return { error: "username  already registered " };
//     }
//     //create new token
//     const access_token = createToken(body.username);
//     const myAccount = await Accounts.create({
//       ...body,
//       access_token,
//     }); //register new user
//     let accountNew = _.omit(myAccount.toJSON(), [
//       "accountId",
//       "createdAt",
//       "updatedAt",
//       "deletedAt",
//     ]);
//     return { account: accountNew };
//   } catch (error) {
//     return { error: error.message };
//   }
// }

//!  edited because should user id and manger id
async function updateAccount(body) {
  try {
    const ans = await Accounts.findOne({
      where: { userId: body.userId },
    });
    if (!ans) {
      return { error: "user id is not valid " };
    }

    if (
      await Accounts.findOne({
        where: { id: { [Op.ne]: body.id }, username: body.username },
      })
    ) {
      return { message: "username  already registered for other user " };
    }
    //if account is disable
    if (
      await Accounts.findOne({
        where: {
          id: { [Op.ne]: body.id },

          username: body.username,
        },
        paranoid: false,
      })
    ) {
      return { message: "account is disabled you can re Active account ...." };
    }

    // if (
    //   (await Accounts.findOne({
    //     where: { userId: body.userId },
    //   })) ||
    //   (await Accounts.findOne({
    //     where: { userId: body.userId },
    //     paranoid: false,
    //   }))
    // )
    // console.log(body);
    //update account details
    await Accounts.update(
      {
        username: body.username,
        password: body.password,
      },
      {
        where: {
          userId: body.userId,
        },
      }
    ); //update  new user
    const myAccount = await Accounts.findOne({
      where: {
        userId: body.userId,
      },
    });
    let accountNew = _.omit(myAccount.toJSON(), [
      "accountId",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ]);
    // console.log({ account: accountNew });
    return { account: accountNew };
  } catch (error) {
    return { error: error.message };
  }
}

//login
async function login(req, res) {
  try {
    const account = await Accounts.findOne({
      where: { username: req.body.username },
    });
    if (account) {
      //compare password
      const validPassword = await compare(req.body.password, account.password);
      if (validPassword) {
        let access_token = createToken({ username: req.body.username });
        // update token in database
        // console.log(access_token);
        await Accounts.update(
          { access_token },
          { where: { username: req.body.username } }
        );
        const update_user = await Accounts.findOne({
          where: { username: req.body.username },
        });
        let user_new = _.omit(update_user.toJSON(), [
          "accountId",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "mangerId",
          "userId",
        ]);
        return res
          .status(200)
          .send({ message: "login successfully ✅", account: user_new });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(400).json({ error: "userName is not Found " });
    }
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
}

//logout
async function logout(req, res) {
  try {
    // console.log(req.access_token);
    const account = await Accounts.findOne({
      where: { access_token: req.account.access_token },
    });
    if (account) {
      //delete access token
      await Accounts.update(
        { access_token: "" },
        { where: { username: account.username } }
      );
      return res.status(200).send({ message: "logout successfully ✅" });
    } else {
      return res.status(400).json({ error: "account is not valid token  " });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
}
module.exports = { register, login, logout, updateAccount };
