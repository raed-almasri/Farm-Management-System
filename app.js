const express = require("express");
const app = express();
require("dotenv").config({ path: `./.env` });
const cookieParser = require("cookie-parser");
const { notification } = require("./utils/scheduler");
app.use(cookieParser());
//convert to JSON
app.use(express.json());
require("./config/cors")(app);

// routers
app.use(require("./routers"));

//cors (for front end )
// //?if you want to create or update database execute this code
const sequelize = require("./utils/connect");
// use to create all relations with table
require("./models/relations");

// sequelize
//     .sync({ force: true })
//     .then(async (_) => {
//         const default_data = require("./utils/default_data");
//         await default_data();
//         console.log(
//             "successfully create or Updated tables attribute ✅ ✔✅🎉 "
//         );
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// //run at port
app.listen(process.env.PORT, async () => {
    await notification();
    console.log(`Server Run of Port : ${process.env.PORT}  ✔✅`);
});
