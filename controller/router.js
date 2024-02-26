const express = require('express');
const { login, loginWithEmail, loginWithPhone, verifyOTP } = require('./login');
const { signup } = require('./signup');
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
router.route('/verifyOtp').post(verifyOTP);
router.route('/signup').post( signup);
router.route('/home').get(userAuth,home);
router.route('/verifymail').post(verifyMail)
router.route('/sendnotification').post(sendNotification)
router.route('/getcontacts').get(getContacts)
router.route('/addcontact').put(updateContacts)
router.route('/deletecontact').put(deleteContact)
router.route('/getcurrentuser').get(userAuth,getCurrentUser)
router.route('/sendsms').post(sendSMS);
router.route('/newemergency').post(require('./webapis').newEmergency);
module.exports = router