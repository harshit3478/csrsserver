const express = require('express');
const { login, loginWithEmail, loginWithPhone, verifyOTP, verifyOTPForLogin } = require('./login');
const { signup, sendOtpOnEmail, sendOtpOnPhone, verifyOTPForSignup } = require('./signup');
const { home , logout , getCurrentUser} = require('./main');
const { sendNotification } = require('./notification');
const { getContacts , updateContacts , deleteContact } = require('./contact');
const { userAuth } = require('../middleware/auth');
const { verifyMail } = require('./sendmail');
const { sendSMS } = require('./sendsms');
const multer = require("multer");
const update = require('./update');
const router = express.Router();
const { User } = require("../mongoose/User");
const uploadFile = require('../middleware/upload.js');
console.log(typeof(update) , typeof(uploadFile));
router.post('/update', uploadFile.single('avatar'), async(req, res) => {
    const {email } = req.body;
    console.log(email)
    try{
      const user = await User.findOne({email : email});
      console.log(user);
      if(!user) return res.status(411).send({status : 'error' , message : 'user not found',  code : -1});
    
      const data = await uploadToCloudinary(req.file.path , "user-images");
        console.log(data);
   
      const updatedUser = await User.updateOne({
        email : email ,
      },{
        $set : {
          imageUrl : data.url,
          publicId : data.public_id
        }
      });
      res.status(200).send({status : 'success' , message : 'user updated',  code : 1});
    }
    catch(err){
      res.status(500).send({status : 'error' , message : 'error is ' + err.message,  code : -3});
    }
  });
router.route('/login').post(login);
router.route('/login/email').post(loginWithEmail);
router.route('/login/phone').post(loginWithPhone);
router.route('/login/verify').post(verifyOTPForLogin);
router.route('/signup/verify').post(verifyOTPForSignup);
router.route('/signup/email').post(sendOtpOnEmail);
router.route('/signup/phone').post(sendOtpOnPhone);
router.route('/signup').post( signup);
router.route('/home').get(userAuth,home);
router.route('/verifymail').post(verifyMail)
router.route('/send/notification').post(sendNotification)
router.route('/getcontacts').get(getContacts)
router.route('/add/contact').put(updateContacts)
router.route('/delete/contact').put(deleteContact)
router.route('/getcurrentuser').get(userAuth,getCurrentUser)
router.route('/send/sms').post(sendSMS);
router.route('/newemergency').post(require('./webapis').newEmergency);
module.exports = router