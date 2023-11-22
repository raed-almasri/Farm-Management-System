const userInterests = require("../../modules/Users/userInterests"); //module User
const Users = require("../../modules/Users/Users"); //module User
const _ = require("lodash");

//create
async function createInterests(body) {
  try {
    if (!(await Users.findByPk(body.id))) return { error: "user id is wrong " };

    body.Interests.map(async (interest) => {
      //   console.log(interest);
      //if already added then don't do any thing otherwise add
      if (
        !(await userInterests.findOne({
          where: { userId: body.id, nameInterest: interest },
        }))
      )
        //  console.log({ userId: body.id, nameInterest: interest });
        await userInterests.create({
          userId: body.id,
          nameInterest: interest,
        });
    });
  } catch (error) {
    return { error: error.message };
  }
}
//delete and update
async function updateInterests(body) {
  try {
    if (!(await Users.findByPk(body.id))) return { error: "user id is wrong " };

    //delete every record of this user , then add new with new interest
    await userInterests.destroy({ where: { userId: body.id }, force: true });

    //add new interest
    body.Interests.map(async (interest) => {
      //if already added then don't do any thing otherwise add
      if (
        !(await userInterests.findOne({
          where: { userId: body.id, nameInterest: interest },
        }))
      )
        await userInterests.create({
          userId: body.id,
          nameInterest: interest,
        });
    });
  } catch (error) {
    return { error: error.message };
  }
}

module.exports = { createInterests, updateInterests };
