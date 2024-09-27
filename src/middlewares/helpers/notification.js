
const admin = require('firebase-admin');
const serviceAccount = require('../../../service_account.json');
// Initialize the Firebase Admin SDK (you'll need to set up your service account)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // other configuration options...
});

async function sendNotification(fcmToken, title, body, latitude, longitude) {
  try {
    console.log("token is:", fcmToken);
    console.log("title is:", title);
    console.log("body is:", body);
    console.log("latitude is:", latitude);
    console.log("longitude is:", longitude);

    let message;
    if (latitude !== undefined && longitude !== undefined) {
      message = {
        token: fcmToken,
        android: {
          priority: "high",
        },
        data: {
          title: title,
          body: body,
          lang: "en",
          type: "sos",
          latitude: latitude,
          longitude: longitude,
        }
      };
    } else {
      message = {
        token: fcmToken,
        android: {
          priority: "high",
        },
        data: {
          title: title,
          body: body,
          lang: "en",
          type: "resolve",
        }
      };
    }

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

module.exports = sendNotification;