const express = require('express');
const { login, signup, home, sendNotification, getContacts, updateContacts, deleteContact, getCurrentUser } = require('./apis');
const { userAuth } = require('../middleware/auth');
const { verifyMail } = require('./sendmail');
const router = express.Router();


router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/home').get(userAuth,home);
router.route('/verifymail').post(verifyMail)
router.route('/sendnotification').post(sendNotification)
router.route('/getcontacts').get(getContacts)
router.route('/addcontact').put(updateContacts)
router.route('/deletecontact').put(deleteContact)
router.route('/getcurrentuser').get(userAuth,getCurrentUser)
module.exports = router