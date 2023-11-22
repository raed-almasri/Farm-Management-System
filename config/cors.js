const cors = require("cors");
module.exports = (app) => {
    app.all("/*", function (req, res, next) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Credentials", true);
        res.header(
            "Access-Control-Allow-Methods",
            "GET,PUT,POST,DELETE,OPTIONS"
        );
        res.header(
            "Access-Control-Allow-Headers",
            "Content-Type,Accept,X-Access-Token,X-Key,Authorization,X-Requested-With,Origin,Access-Control-Allow-Origin,Access-Control-Allow-Credentials"
        );
        if (req.method === "OPTIONS") {
            res.status(200).end();
        } else {
            next();
        }
    });

    app.use(cors());

    app.use(
        cors({
            origin: "*",
        })
    );
    app.use(
        cors({
            origin: ["*"],
        })
    );

    app.use(
        cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );
};
