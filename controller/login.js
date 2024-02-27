const jwt = require("jsonwebtoken");
const express = require('express');
const https = require("https");
const { User } = require("../mongoose/User");
const bcrypt = require("bcryptjs");
const {client } = require("../redis.js")
const {verifyMail} = require('./sendmail');
const { sendSMS } = require("./sendsms.js");
const speakeasy = require('speakeasy');
require('dotenv').config();
const app = express();


const jwtSecret = process.env.JWT_SECRET;

exports.login = async (req, res, next) => {
    const { email , password } = req.body;
    console.log("login request's body:", req.body);
    if( !(email ==='')&& !(password==='') ){
  
    
    try {
     const  person = (await User.findOne({ email: email }));
  
      if (person) {
        bcrypt.compare(password, person.password).then((result) => {
          if (result) {
            console.log(result)
            //json web token for authorization
            const maxAge = 96 * 60 * 60 * 100 ;
            const token = jwt.sign(
              { id: person._id, username : person.username , email: person.email , imageUrl : person.imageUrl, publicId : person.publicId , userId : person.userId , phone : person.phone , contacts : person.contacts},
              jwtSecret,
              {
                expiresIn: maxAge, // 3hrs in sec
              }
            );
            console.log(token);
            res.cookie("jwt", token, {
              httpOnly: true,
              
              maxAge: maxAge * 1000, // 3hrs in ms
            });
            res.status(200).send({status : 'ok' , user : person});
          } else {
            res.status(410).send({ status: " error"  , message : '410'}); //  password didn't match
          }
        });
      } else {
        res.status(411).send({status: 'error' , message: 'user do not exist '});  /// user do not exist
      }
    } catch (err) {
      console.log(err);
    }
  }
  else{
    res.status(412).send({status: 'error' , message: '412'}) /// fields can't be blank
  }
  };
  exports.loginWithEmail = async (req, res) => {
    try {
        if (!req.body.email) return res.status(400).json({ success: false, message: "Please enter email" , code : 1});

        const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("email").exec();
        if (!user) return res.status(400).json({ success: false, message: "User does not exist"  , code : -1 });

        const secret = speakeasy.generateSecret({ length: 20 });
        console.log(secret);

        // Generate OTP
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: "base32"
        });

        // save the secret key in the user object or database
        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" , code : -4  });
        await client.set(user.email,  secret.base32, { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
            if (err) {
                console.log("error in setting redis key", err);
                return res.status(500).json({ success: false, message: "Redis client error", code : -4 });
            }
            console.log(res);
        });

        
// Send OTP to user (e.g., via email or SMS)
        verifyMail(req.body.email, otp);
        await user.save();
        return res.status(200).json({ success: true, message: "OTP sent to your email" , code : 0 });
     } catch (e) {
        console.log("error in loginWithOtp" , e.message)
        res.status(400).json({ success: false, message: e.message  , code : -3})
    }
}
  exports.loginWithPhone = async (req, res) => { 
    try {
      console.log(req.body.phone);
      if (!req.body.phone) return res.status(400).json({ success: false, message: "Please enter phone" , code : 1});

      const user = await User.findOne({ phone: req.body.phone }).select("phone").exec();
      if (!user) return res.status(400).json({ success: false, message: "User does not exist"  , code : -1 });
      console.log
      const secret = speakeasy.generateSecret({ length: 20 });
      console.log(secret);

        // Generate OTP
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: "base32"
        });
        console.log(otp);
        // save the secret key in the user object or database
        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" , code : -4  });
        await client.set(user.phone,  secret.base32 , { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
            if (err) {
                console.log("error in setting redis key", err);
                return res.status(500).json({ success: false, message: "Redis client error", code : -4 });
            }
            console.log(res);
        });
// Send OTP to user (e.g., via email or SMS)
     sendSMS(req.body.phone, otp);
        await user.save();
        return res.status(200).json({ success: true, message: "OTP sent to your phone" , code : 0 });
     } catch (e) {
        console.log("error in loginWithPhone" , e.message)
        res.status(400).json({ success: false, message: e.message  , code : -3})
    }
}
exports.verifyOTPForLogin = async (req, res) => {
  try {
      const { otp } = req.body;
      const phoneOrEmail = req.body.email || req.body.phone; 
      console.log(phoneOrEmail, otp);
      if (!otp) return res.status(400).json({ success: false, message: "Please enter OTP" });

      if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" });
      const secret = await client.get(req.body.email || req.body.phone, (err, res) => {
          if (err) console.log(err);
          console.log(res);
      });
      console.log('secret is :', secret);
      // Verify OTP
      const verified = speakeasy.totp.verify({
          secret: secret,
          encoding: "base32",
          token: otp,
          window: 3 // Allow 1-time step tolerance in verification
      });
      
      if (verified) {
          // OTP verification successful
          // Proceed with login logic
          const user = await User.findOne({email: req.body.email }).exec() || await User.findOne({phone: req.body.phone}).exec();
          const maxAge = 96 * 60 * 60 * 100 ;
          const token = jwt.sign({ userId: user }, jwtSecret, { expiresIn: maxAge }, (err, token) => {
              if (err) return res.status(400).json({ success: false, message: "Login error : " + err.message });
              // return res.status(200).json({ success: true, message: "Login successful", token });
              
          });
          console.log(token);
          res.cookie("jwt", token, {
            httpOnly: true,
            
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(200).json({ success: true, message: "Logged in successfully" });
      } else {
          // OTP verification failed
          res.status(400).json({ success: false, message: "Invalid OTP" });
      }
  } catch (e) {
      res.status(400).json({ success: false, message: e.message })
  }
}
