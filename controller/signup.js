const jwt = require("jsonwebtoken");
const express = require('express');
const https = require("https");
const { User } = require("../mongoose/User");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");
const multer = require("multer")
const { GridFsStorage } = require("multer-gridfs-storage")
require('dotenv').config();
const app = express();

const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res, next) => {
    // console.log(typeof(salt))
    try {
      console.log(req.body);
      const user = new User(req.body);
      try{
        await user.validate();
      }
      catch(e){
        return res.status(400).send({ status: "error", message: e.message , code : -5 });
      }
      bcrypt.hash(req.body.password, 10,async function(err, hash) {
        // Store hash in your password DB.
         await user.set('password', hash);
        console.log("hashed password", hash);
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Error in hashing password" });
        }
    });

    console.log("user registered successfully" , user);
    await user.save();
    
    res.status(200).json({ success: true, message: "User registered successfully" });

    }
    catch(e){
      return res.status(400).send({ status: "error", message: e.message , code : -1 });
    }
  //   const { username, password, email , userID } = req.body;
  //   console.log(username , password , email);
  //   if(!(username==='') && !(password==='') && !(email==='') && !(userID==='') && !username && !password && !email && !userID)
  //    {
  //   try {
      
  //     let is_user2 = User.findOne({ email: email });
  //     array2 = await is_user2;
  //     if (!array2) {
  //       bcrypt.hash(password, '$2a$10$kIb4bwk/dxcJLRVUvZN2fu').then(async (hash) => {
  //         await User.create({
  //           username,
  //           password: hash,
  //           email,
  //           userId : userID,
  //         }).then((user) => {
            
  //           res.status(200).json({ status: "ok", user: user._id });
  //         });
  //       });
  //       console.log("user created : ", username, password, email , userID);
        
  //     } else if (array2) {
  //       res.status(410).send({ status: "error", message: "email already exist" });
      
  //     } else {
  //       res.status(411).send({ status: "error", message: "something went wrong" });
       
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).send({ status: "error", message: err });
      
  //   }
  // }
  };
  