const jwt = require("jsonwebtoken");
const express = require('express');
const https = require("https");
const { User } = require("../mongoose/User");
const bcrypt = require("bcryptjs");
const { verifyMail } = require('./sendmail');
const { sendSMS } = require("./sendsms.js");
const speakeasy = require('speakeasy');
const { client } = require("../redis.js");
require('dotenv').config();
const app = express();


const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res, next) => {
  // console.log(typeof(salt))
  try {
    console.log(req.body);
    const user = new User(req.body);
    try {
      await user.validate();
    }
    catch (e) {
      return res.status(400).send({ status: "error", message: e.message, code: -5 });
    }
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      // Store hash in your password DB.
      await user.set('password', hash);
      console.log("hashed password", hash);
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Error in hashing password" });
      }
    });

    console.log("user registered successfully", user);
    await user.save();

    res.status(200).json({ success: true, message: "User registered successfully" });

  }
  catch (e) {
    return res.status(400).send({ status: "error", message: e.message, code: -1 });
  }

};

exports.sendOtpOnEmail = async (req, res) => {
  console.log("verify mail request's body:", req.body);
  const { email } = req.body;
  try {
    const person = await User.findOne({ email: email });
    if (person) res.status(400).send({ status: "error", message: "Email already registered", code: -2 });
    else {
      const secret = speakeasy.generateSecret({ length: 20 });
      console.log(secret);
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32"
      });
      console.log(otp, 'secret base 32 is', secret.base32);
      // save the secret key in the user object or database
      if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error", code: -4 });
      await client.set(email, secret.base32, { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
        if (err) {
          console.log("error in setting redis key", err);
          return res.status(500).json({ success: false, message: "Redis client error", code: -4 });
        }
        console.log(res);
      });
      try {
        await verifyMail(email, otp);

      }
      catch (e) {
        return res.status(400).send({ status: "error", message: e.message, code: -1 });
      }
      res.status(200).send({ otp: otp, message: "OTP sent to your email", success: true, code: 1 });
    }
  } catch (e) {
    console.log("error in verifyOTP", e.message);
    // res.status(400).json({ success: false, message: e.message, code: -3 });
  }
}

exports.sendOtpOnPhone = async (req, res) => {
  console.log("verify phone request's body:", req.body);
  const { phone } = req.body;
  try {
    const person = await User.findOne({ phone: phone });
    if (person) res.status(400).send({ status: "error", message: "Phone already registered", code: -2 });
    else {
      const secret = speakeasy.generateSecret({ length: 20 });
      console.log(secret);
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32"
      });

      // save the secret key in the user object or database
      if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error", code: -4 });
      await client.set(phone, secret.base32, { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
        if (err) {
          console.log("error in setting redis key", err);
          return res.status(500).json({ success: false, message: "Redis client error", code: -4 });
        }
        console.log(res);
      });
      try {
        await sendSMS(phone, otp);

      }
      catch (e) {
        return res.status(400).send({ status: "error", message: e.message, code: -1 });
      }
      res.status(200).send({ otp: otp, message: "OTP sent to your phone", success: true, code: 1 });
    }
  }
  catch (e) {
    console.log("error in verifyOTP", e.message);
    // res.status(400).json({ success: false, message: e.message, code: -3 });
  }
}
exports.verifyOTPForSignup = async (req, res) => {
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
          window: 2 // Allow 1-time step tolerance in verification
      });
      
      if (verified) {
          // OTP verification successful
          // Proceed with login logic
          res.status(200).json({ success: true, message: "OTP verification successful" });
          // res.status(200).json({ success: true, message: "OTP verification successful" });
      } else {
          // OTP verification failed
          res.status(400).json({ success: false, message: "Invalid OTP" });
      }
  } catch (e) {
      res.status(400).json({ success: false, message: e.message })
  }
}