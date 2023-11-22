const role = require("../models/role.model");
const user = require("../models/user.model");
require("../models/relations");

module.exports = async () => {
    let allRoles = [
        {
            name: "admin",
            data: `{"show":[],"permission":["Production section","surveillance section","health care section","Mange section","medicalCondition","Home page"]}`,
        },
        {
            name: "health_user",
            data: `{"show":[],"permission":["health care section","medicalCondition"]}`,
        },
        {
            name: "surveillance_user",
            data: `{"show":[],"permission":["surveillance section"]}`,
        },
        {
            name: "Production_user",
            data: `{"show":[],"permission":["Production section"]}`,
        },
    ];

    //create all roles default
    await role.bulkCreate(allRoles);

    //create admin account
    await user.create({
        name: "admin",
        username: "admin",
        password: "qwe123QWE!@#",
        roleId: 1,
    });
    //create admin account
    await user.create({
        name: "admin2",
        username: "admin2",
        password: "qwe123QWE!@#",
        roleId: 2,
    }); //create admin account
    await user.create({
        name: "admin3",
        username: "admin3",
        password: "qwe123QWE!@#",
        roleId: 3,
    });
    await user.create({
        name: "admin4",
        username: "admin4",
        password: "qwe123QWE!@#",
        roleId: 4,
    });
};
