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


exports.home = (req, res) => {
    res.status(200).json({ status: 'ok', message: 'authentication successful' });
}
exports.logout = (req , res)=>{
  res.cookie('jwt' , '' , {maxAge : 1});
  res.status(200).send({status : 'ok' , message : 'logged out successfully'})
}

exports.getCurrentUser = async (req , res)=>{

  if(req.user){
    console.log(req.user);
    const user = await User.findOne({email : req.user.email});
    return res.status(200).send({status : 'ok' , message : 'user fetched successfully' , data : user});
  }
  else{
    return res.status(411).send({status : 'error' , message : 'user not found'})
  }
}