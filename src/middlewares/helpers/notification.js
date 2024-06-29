const AWS = require("aws-sdk");
require("dotenv").config();
const firebaseAdmin = require("firebase-admin");
AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "ap-south-1",
});
class MySNS {
    constructor(){
        this.SNS = new aws.SNS();
    }   
}

const ApplicationArn = process.env.APPLICATION_ARN;
console.log(ApplicationArn);
const sns = new AWS.SNS();
const serviceAccount = require("./service.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    // Add other configuration options if needed
});
async function sendPushNotification(message, fcmToken, targetArn) {
    const params = {
        TargetArn: targetArn, // ARN of your SNS platform application
        MessageStructure: "json",
        Message: JSON.stringify({
            default: JSON.stringify(message),
            GCM: JSON.stringify({
                data: {
                    message: message,
                },
                token: fcmToken,
            }),
        }),
    };

    try {
        const data = await sns.publish(params).promise();
        console.log("Push notification sent successfully:", data.MessageId);
        return data.MessageId;
    } catch (error) {
        console.error("Error sending push notification:", error);
        // throw error;
    }
}
async function registerEndPoint(deviceToken, applicationArn) {
    const params = {
        Token: deviceToken,
        PlatformApplicationArn: applicationArn,
    };
    const { EndpointArn } = await sns.createPlatformEndpoint(params).promise();
    return EndpointArn;
}
exports.sendNotificationSNS = async (req, res) => {
    try {
        const message = {
            GCM: {
                notification: {
                    android: {},
                    title: req.body.title || "Notification Title",
                    body: req.body.body || "Notification Body",
                },
                data: {
                    lang: "en",
                    type: "msj",
                    langitude: req.body.langitude || "12",
                    longitude: req.body.longitude || "12",
                },
                messageId: "123",
            },
        };
        const token = req.body.token;
        const topicArn = await registerEndPoint(req.body.token, ApplicationArn);
        console.log("topicArn is : ", topicArn.toString());
        sendPushNotification(message, token, topicArn.toString());
        console.log('push notification sent ............');
        return res
            .status(200)
            .send({
                status: "ok",
                message: "notification sent successfully",
                code: 1,
            });
    } catch (e) {
        console.log("error in sending push notification is : ", e);
        return res
            .status(500)
            .send({
                status: "error",
                message: "error in sending push notification is : " + e,
                code: -1,
            });
    }
};