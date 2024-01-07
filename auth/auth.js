const jwt = require("jsonwebtoken");
const express = require('express');

const { User } = require("../mongoose/User");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");

require('dotenv').config();
const app = express();



  



const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res, next) => {
  console.log(typeof(salt))
  const { username, password, email } = req.body;
  console.log(username , password , email);
  if(!(username==='') && !(password==='') && !(email==='')){
  try {
    let is_user1 = User.find({ username: username });
    let is_user2 = User.find({ email: email });
    array1 = (await is_user1).length;
    array2 = (await is_user2).length;
    if (!(array1 || array2)) {
      bcrypt.hash(password, '$2a$10$kIb4bwk/dxcJLRVUvZN2fu').then(async (hash) => {
        await User.create({
          username,
          password: hash,
          email,
        }).then((user) => {
          
          res.json({ status: "ok", user: user._id });
        });
      });
      console.log("user created : ", username, password, email);
      
    } else if (array1) {
      res.status(410).json("<h1>user already exist</h1>");
    
    } else {
      res.status(411).json("<h1>user already exist</h1>");
     
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error", err });
    //  alert("couldn't process , please retry")
  }
}
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log("login request's body:", req.body);
  if( !(username==='')&& !(password==='') ){

  
  try {
   const  person =
      (await User.findOne({ username: username })) ||
      (await User.findOne({ email: username }));

    if (person) {
      bcrypt.compare(password, person.password).then((result) => {
        if (result) {
          console.log(result)
          //json web token for authorization
          const maxAge = 96 * 60 * 60;
          const token = jwt.sign(
            { id: person._id, username, email: person.email },
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
      res.status(411).send({status: 'error' , message: '411'});  /// user do not exist
    }
  } catch (err) {
    console.log(err);
  }
}
else{
  res.status(412).send({status: 'error' , message: '412'}) /// fields can't be blank
}
};
// module.exports = salt;
// module.exports = salt

exports.home = (req ,res)=>{
    res.status(200).json({status : 'ok' , message : 'authentication successful '})
}