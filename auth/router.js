const express = require('express');
const { login, signup, home } = require('./auth');
const { userAuth } = require('../middleware/auth');
const { verifyMail } = require('./sendmail');
const router = express.Router();


router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/home').get(userAuth,home);
router.route('/verifymail').post(verifyMail)
module.exports = router