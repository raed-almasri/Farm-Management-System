let role = require("./role.model");
let user = require("./user.model");
let notification = require("./notification.model");
let animals = require("./animals.model");
let Insemination = require("./Insemination.model");
let MedicalCondition = require("./MedicalCondition.model"); 
let productivity = require("./productivity.model");
// let protectVaccines = require("./protectVaccines.model");

role.hasMany(user, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});
user.belongsTo(role);

user.hasMany(notification, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});
notification.belongsTo(user);

animals.hasMany(Insemination, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});
Insemination.belongsTo(animals);

animals.hasMany(productivity, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});
productivity.belongsTo(animals);
 
animals.hasMany(MedicalCondition, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
});
MedicalCondition.belongsTo(animals);
