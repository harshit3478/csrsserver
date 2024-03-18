const express = require('express');
const { login, loginWithEmail, loginWithPhone, verifyOTP, verifyOTPForLogin } = require('./login');
const { signup, sendOtpOnEmail, sendOtpOnPhone, verifyOTPForSignup } = require('./signup');
const { home, logout, getCurrentUser } = require('./main');
const { sendNotificationSNS } = require('./notification');
const { getContacts, updateContacts, deleteContact } = require('./contact');
const { userAuth } = require('../middleware/auth');
const { verifyMail } = require('./sendmail');
const { sendSMS } = require('./sendsms');
const multer = require("multer");
const update = require('./update');
const router = express.Router();
const { User } = require("../mongoose/User");
const uploadFile = require('../middleware/upload.js');
const { adminLogin, getCurrentAdminUser } = require('./admin.js');
const { socket } = require('./socket.js');
const { updateSensitivity, updateDescription, updateEmergency, getEmergencies } = require('./webapis');
console.log(typeof (update), typeof (uploadFile));
router.post('/update', uploadFile.single('avatar'), async (req, res) => {
  const { email, name, rollNo } = req.body;
  console.log(email, name)
  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (!user) return res.status(411).send({ status: 'error', message: 'user not found', code: -1 });

    const data = await uploadToCloudinary(req.file.path, "user-images");
    console.log('cloudinary data is : ', data);
    if (data) {
      const updatedUser = await User.updateOne({
        email: email,
      }, {
        $set: {
          imageUrl: data.url,
          publicId: data.public_id,
          username: name,
          rollNo: rollNo,
        }
      });
    } else {
      const updatedUser = await User.updateOne({
        email: email,
      }, {
        $set: {
          username: name,
          rollNo: rollNO,
        }
      });
    }
    res.status(200).send({ status: 'success', message: 'user updated', code: 1 });
  }
  catch (err) {
    res.status(500).send({ status: 'error', message: 'error is ' + err.message, code: -3 });
  }
});
router.route('/login').post(login);
router.route('/update/token').post(update.updateToken);
router.route('/login/email').post(loginWithEmail);
router.route('/login/phone').post(loginWithPhone);
router.route('/login/verify').post(verifyOTPForLogin);
router.route('/signup/verify').post(verifyOTPForSignup);
router.route('/signup/email').post(sendOtpOnEmail);
router.route('/signup/phone').post(sendOtpOnPhone);
router.route('/signup').post(signup);
router.route('/home').get(userAuth, home);
router.route('/verifymail').post(verifyMail);
router.route('/send/notification').post(sendNotificationSNS);
router.route('/getcontacts').get(getContacts)
router.route('/add/contact').put(updateContacts)
router.route('/delete/contact').put(deleteContact)
router.route('/getcurrentuser').get(userAuth, getCurrentUser)
router.route('/send/sms').post(sendSMS);
router.route('/emergency/new').post(require('./webapis').newEmergency);
router.route('/emergency/get').get(userAuth, getEmergencies);
router.route('/emergency/resolve').put(require('./webapis').resolveEmergency);
router.route('/login/admin').post(adminLogin);
router.route("/get/admin").get(userAuth , getCurrentAdminUser);
router.route('/socket').get(socket);
router.route('/emergency/update/sensitivity').put(updateSensitivity);
router.route('/emergency/update/description').put(updateDescription);
router.route('/emergency/update').put(updateEmergency);
module.exports = router