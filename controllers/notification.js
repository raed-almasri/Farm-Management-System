const { sendNotification } = require("../utils/notification");

module.exports.send = async (req, res, next) => {
    try {
        await sendNotification(req.body.token, req.body);
        res.status(200).send({ Message: "Successfully sent with response" });
    } catch (error) {
        res.send(error);
    }
};
