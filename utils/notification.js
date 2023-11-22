const dotenv = require("dotenv");
dotenv.config({
    path: "../.env",
});
const FCM = require("fcm-node");
const serverKey = process.env.FIREBASE_KEY; //put your server key here
const fcm = new FCM(serverKey);

module.exports.sendNotification = async (token, notificationData) => {
    const message = {
        //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: token,
        notification: {
            title: notificationData.title,
            body: notificationData.body,
        },
        //flutter app
        // data: {
        //     click_action: "FLUTTER_NOTIFICATION_CLICK",
        //     id: "1",
        //     status: "done",
        // },
    };

    fcm.send(message, function (err, response) {
        if (err) {
            return { error: err };
        } else {
            return response;
        }
    });
};

module.exports.sendMultipleNotifications = async (tokens, notificationData) => {
    // send to multiple tokens

    const message = {
        registration_ids: tokens,
        notification: {
            title: notificationData.title,
            body: notificationData.body,
        },
    };

    fcm.send(message, function (err, response) {
        if (err) {
            return { error: err };
        } else {
            return response;
        }
    });
};
