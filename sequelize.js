//This link sequelize :https://sequelize.org/docs/v6/core-concepts/model-basics/

//let's Starting

//connect with mysql
var Sequelize = require("sequelize");
//config setting of connection
const sequelize = new Sequelize("projectfirst", "raed", "qwe123QWE!@#", {
  dialect: "mysql",
});
try {
  sequelize.authenticate(); //use to connect with the mysql
  console.log("connection successfully");
} catch (err) {
  console.log("error: " + err);
}
//different between Sync

User.sync();
// create the table if it dons't exist
// does nothings it already exists

User.sync({ force: true });
// create the tab1le
// drops it first if it already exists

User.sync({ alter: true });
// checks the current state of database
// {columns it has their data type,}
// performs necessary changes in the table to make it match the module state

//Model Basics
User.drop(); //use to delete the module form database
User.define(); //use to create new module in database

//Model Instances
//we can crete new instance user from two way :
const user = User.build({}); //create new use but is don't sae yet
user.save(); //use to save in database
//is not automatically called validate , should write user.validate()
// or this way
User.create({}); //this way use to create new user and save in database
//is automatically called validate
//create array of user
user.bulkCreate([, {}, {}, {}]); //this use to create array of objects and save automatic in database
user.bulkCreate([, {}, {}, {}], { validate: true }); //this use to create array of objects and save automatic in database and to validate the all record

//destroy
user.destroy(); //use to delete user from database
//delete every users has age less then 18
User.destroy({ where: { age: { [Op.lt]: 18 } } });
//delete from user where age<18
User.destroy({ truncate: true });
// use to delete every record in the table but  is not remove table

user.reload(); // use to when save , save the original data ,mean if we change any data then is return and save the orginal data
//if we want save just specific field then writ :
user.save({ fields: ["age", "name"] }); //if change any thing field then just age and name is save in database
//user can decrement and increment any field in database just use this methods:
user.increment({ age: 2, long: 4 }); //this statement use to add  the age by 2 and long by 4
user.decrement({ age: 2, long: 4 }); //this statement use to minus the age by 2 and long by 4

///Model Querying - Finders
User.findAll(); //use to return all row in table
//is like select * from user
User.findAll({ attributes: ["Age", "Name"] }); //use to return age and name for every record in user table
//is like select age ,name from user

//* we can use function with sql like avg,sum...etc
User.findAll({ attributes: [sequelize.fn("SUM", sequelize.col("age"))] });
//is like select SUM(age) from user
User.findALl({
  attributes: [[sequelize.fn("SUM", sequelize.col("age")), "allAge"]],
});
//like select Sum(age) as allAge from user

//we can return every things without some field
User.findALl({ attributes: { exclude: ["password"] } });
//is mean return every things fields without password

User.findAll({ where: { age: 90 } });
// is like select * from user where age==90

User.findAll({ attributes: ["username", "password"], where: { age: 90 } });
//is like select username ,password form user where age ==90

User.findAll({ limit: 2 });
//is like select * from user limit 2
//use to get first two rows

//Order
User.findAll({ order: [["age", "DESC"]] });
// is like select * from user order by age DESC
//we know we can order by Asc or DESC

//group by
//you task return username and sum of age for every username
User.findAll({
  attributes: [
    "username",
    [sequelize.fn("SUM", sequelize.col("age")), "sum_age"],
  ],
  group: "username",
});

//is like select username ,SUM(age) as sum_Age from user group by username

//Operations
User.findAll({ where: { [Op.or]: { age: 30, username: "Raed" } } });
//Op.or,Op.and...
//is like select * from user where age==30 or username=='Raed' and

//All things about operates form this link :
//https://sequelize.org/docs/v6/core-concepts/model-querying-basics/

//if we want to apply any function in query should use sequelize.where()
//sequelize.where() , is have three args , one : is function we need to execute , two : name of the field ,three : number should compare with it
User.findAll({
  where: sequelize.where(
    sequelize.fn("char_length", sequelize.col("username")),
    10
  ),
});
//this use to get all record has number of char in name is 10
// select * from user  where char_length(name)==10

//return all record has age above or equal 10
User.findAll({
  where: {
    age: { [Op.gte]: 10 },
  },
});

//return all record has length of username above or equal 20
User.findAll({
  where: sequelize.where("char_length", sequelize.col("username"), {
    [Op.gte]: 20,
  }),
});
//select * from users where char_length(username)>=20

///return username and password record has age above the 20 and username ended at ED and email ended @gmail.com and length username is less then 10
User.finAll({
  attributes: ["username", "password"],
  where: [
    { age: { [Op.gt]: 20 } },
    sequelize.where("length", sequelize.col("username"), { [Op.lt]: 10 }),
    { username: { [Op.iLike]: "%ED" } },
    { email: { [Op.iLike]: "%@gmail.com" } },
  ],
});
//select username,password from user where age >20 and length(username)<10 and username Link '%ED' and email Like '@gmail.com'

//set username is raEd  where age >20
User.update({ username: "raEd" }, { where: { age: { [Op.gt]: 20 } } });
//update user set username ="raEd" where age >20

User.findAll({ where: { age: 10 }, raw: true });
// raw: true  use to return result as object
//use to get all user has age is 10 and return as object
User.findByPK(id_here); //quickly search for user ,because is search at the id

User.findOn({
  where: {
    age: {
      [Op.or]: { [Op.lt]: 18, [Op.gt]: 40, [Op.eq]: 90 },
    },
  },
});
//use to return every user age <18 or age >40 or equal 90
//use to return first row valid the condition ,findAll use to get all result we have it but here return just first result answer

User.max("age"); //use to get max number of age

//use to get min number of age above the 18 year old
// is mean use to get min number above the 18
User.min("age", { where: { [Op.gt]: 18 } });

User.sum("age", { where: { age: { [Op.lte]: 45 } } });

User.findOrCreate({ where: { username: "Raed" } });
//use if the record is not found in database then create it

const { count } = User.findAndCount({ where: { username: "asd" } });
// use to get the count of row is valid this condition

//validate
//Getters, Setters & Virtuals
//example schema
const User = sequelize.define(
  "userssses",
  {
    name: {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
      defaultValue: "Mohammed", //is not set any value for name we can set the default value
      len: [4, 10], //mean min 4 and max 10
      get() {
        //execute when we write  user.name
        const rawValue = this.getDateValue("name"); //use to get the value of the name
        return rawValue.toLowerCase(); //use to return lowercase all char of the name
      },
      set(value) {
        this.setDateValue("name", value.toUpperCase()); //
      },
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      unique: true,
      defaultValue: "asdad",
      validate: {
        isEmail: true, //use to check if is email or not
      },
      isIn: ["raed@gmail.com", "Ahmad@gmail.com"], //if their then continue otherwise reject
    },
    age: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 18,
        max: 60,
      },
    },
    password: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
      async set(value) {
        const salt = await bcrypt.genSalt(10); //use to set generate randome key and is execute the algorithm is 10 times like key
        this.setDateValue(password, await bcrypt.hash(value, salt)); //use to bcrybt the password
      },
      len: [8, 40],
      validate: {
        notIn: ["12345678"],
      },
    },
  },

  {
    timestamp: false,
    freezeTableName: true,
    Paranoid: true, //use if deleted then isn't deleted but set the date deleted it
    validate: {
      usernamePasswordMatch() {
        if (this.username == this.password)
          throw new Error("Please enter your password different of email");
      },
    },
  }
);

///Raw Queries
//use if we want to execute own query then should use this way :
const { QueryTypes } = require("sequelize");
//first args is query , second args is type of query like select of update or ...
const users = await sequelize.query("SELECT * FROM `users`", {
  type: QueryTypes.SELECT,
  plain: false, //use to return one record
  // If plain is true, then sequelize will only return the first
  // record of the result set. In case of false it will return all records.
  raw: false,
  // Set this to true if you don't have a model definition for your query.
  logging: console.log,
  // A function (or false) for logging your queries
  // Will get called for every SQL query that gets sent
  // to the server.
});
// We didn't need to destructure the result here - the results were returned directly

sequelize.query(
  `update user set name =:name , password=:password, age =:myAge where age >80`,
  {
    replacements: { name: "raEd", myAge: 80, password: "213123" }, //use to replace with the variable
    raw: true, ///use to return the meta value
    plain: true, //use to return the one value
  }
);

//Paranoid
// if true then if delete the record then is not delete but set the time deleted in the database
User.restore({ where: {} });
//use to restore the data ,data is re store the same data when first inserted

//Associations
// https://sequelize.org/docs/v6/core-concepts/assocs/
//every things found in this a link
//Note :  The defaults for the One-To-One associations is SET NULL for ON DELETE and CASCADE for ON UPDATE
/*
The A.hasOne(B) association means that a One-To-One relationship exists between A and B, with the foreign key being defined in the target model (B).

The A.belongsTo(B) association means that a One-To-One relationship exists between A and B, with the foreign key being defined in the source model (A).
 */
Foo.hasOne(Bar, {
  foreignKey: {
    // name: 'myFooId'
    type: DataTypes.UUID,
    allowNull: false,
  },
  //foreignKey use if we want specific
  //type , e foreign key data type instead of the default (INTEGER)
  //but here we want t store foreign key as UUID
  //allowNull:false , mean every Foo should has one of Bar
});
// {through: 'ActorMovies' }
//use to create new table and name is ActorMovies
// many to many
//ON DELETE CASCADE ON UPDATE CASCADE
// one to one ,one to many
//ON DELETE set Null ON UPDATE CASCADE
Foo.hasOne(Bar, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Bar.belongsTo(Foo);

///Hooks
// https://sequelize.org/docs/v6/other-topics/hooks/
1;
beforeBulkCreate(instances, options);
beforeBulkDestroy(options);
beforeBulkUpdate(options)(2);
beforeValidate(
  instance,
  options
)(
  // [... validation happens ...]
  3
);
afterValidate(instance, options);
validationFailed(instance, options, error)(4);
beforeCreate(instance, options);
beforeDestroy(instance, options);
beforeUpdate(instance, options);
beforeSave(instance, options);
beforeUpsert(
  values,
  options
)(
  // [... creation/update/destruction happens ...]
  5
);
afterCreate(instance, options);
afterDestroy(instance, options);
afterUpdate(instance, options);
afterSave(instance, options);
afterUpsert(created, options)(6);
afterBulkCreate(instances, options);
afterBulkDestroy(options);
afterBulkUpdate(options);

//Advanced Eager Loading
// اذا ما حطينا شي ساعتها بكون
// full outer join
// اذا حطينا require :true
// ساعتها بكون عنا inner join فقط الشي المشترك
// اذا حطينا require :false
// ساعتها بكون lfet outer join
// ةاذا بدنا right outer join  منحط
// right :true
