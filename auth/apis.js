const jwt = require("jsonwebtoken");
const express = require('express');
const https = require("https");
const { User } = require("../mongoose/User");
const bcrypt = require("bcryptjs");
const { json } = require("body-parser");

require('dotenv').config();
const app = express();

const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res, next) => {
  console.log(typeof(salt))
  const { username, password, email , userID } = req.body;
  console.log(username , password , email);
  if(!(username==='') && !(password==='') && !(email==='')){
  try {
    
    let is_user2 = User.findOne({ email: email });
    array2 = await is_user2;
    if (!array2) {
      bcrypt.hash(password, '$2a$10$kIb4bwk/dxcJLRVUvZN2fu').then(async (hash) => {
        await User.create({
          username,
          password: hash,
          email,
          userId : userID,

        }).then((user) => {
          
          res.status(200).json({ status: "ok", user: user._id });
        });
      });
      console.log("user created : ", username, password, email , userID);
      
    } else if (array2) {
      res.status(410).send({ status: "error", message: "email already exist" });
    
    } else {
      res.status(411).send({ status: "error", message: "something went wrong" });
     
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: "error", message: err });
    
  }
}
};

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
            { id: person._id, username : person.username , email: person.email },
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


exports.home = (req ,res)=>{
    res.status(200).json({status : 'ok' , message : 'authentication successful '})
}

exports.logout = (req , res)=>{
  res.cookie('jwt' , '' , {maxAge : 1});
  res.status(200).send({status : 'ok' , message : 'logged out successfully'})
}

exports.sendNotification = (req , res , next)=>{
  const {userID, lang , long, content } = req.body;
  console.log(userID)

 var message = {
    app_id: process.env.ONESIGNAL_APP_ID,
    contents: { en: content},
    // included_segments: ['All'],
    include_player_ids: [userID],

    content_available: true,
    android_channel_id : "b10f20a7-642a-499a-9e68-de9b340452cb",
    small_icon: "ic_stat_onesignal_default",
    data : {
      "langitude" : lang,
      "longitude" : long,
    },
    big_picture : "https://miro.medium.com/max/1400/1*vrm-FxGlvWnI5LMXqCUSCw.jpeg",
    large_icon : "https://tse4.mm.bing.net/th?id=OIP._gPkZF9gSApIFuuOYHoWEwHaEK&pid=Api&P=0&h=180",
    android_accent_color : "00bfff",
    android_led_color : "00bfff",
    android_visibility : 1,
    color : "8a2be2",
  };
  SendNotification(message , (err , data)=>{
    if(err) {
      return next(err);
    }
    return res.status(200).send({status : 'ok' , message : 'notification sent successfully' , data : data , })
  });
 
}
  

async function SendNotification(data , callback){
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization" : `Basic ${process.env.ONESIGNAL_API_KEY}`
  }

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  }; 

  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
      callback(null , JSON.parse(data))
    });
  });
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
    return callback({
      message : e });
  });
  req.write(JSON.stringify(data));
  req.end();
}


exports.getContacts = async (req , res , next)=>{
  const {email} = req.headers;
  console.log(email)
  try{
    const users = await User.find({});
    console.log('users are : ' , users);
    const user = await User.findOne({email : email});
    console.log(user)
    if(user){
      return res.status(200).send({status : 'ok' , message : 'contacts fetched successfully' , data : user.contacts})
    }
    else{
      return res.status(411).send({status : 'error' , message : 'user not found'})
    }
  }
  catch(err){
    console.log(err)
    return res.status(500).send({status : 'error' , message : 'server error'})
  }
}

exports.updateContacts = async (req , res , next)=>{
   const {email , contact } = req.body;
    console.log(email , contact)
  try{
    const user = await User.findOne({email : email});
    const users = await User.find({});
    console.log(user);
    if(user){
      const isContact = await User.findOne({email : contact});
      console.log('is contacts is : ' , isContact);
      if(!isContact){
        return res.status(411).send({status : 'error' , message : 'your contact is not registered with us'})
      }
      else{
        if(user.contacts.some(c => c.contact === contact || c.userId === isContact.userId) || email == contact){
          console.log('Contact already exists' , 'index of the contact is ' , user.contacts.findIndex(c => c.contact === contact && c.userId === isContact.userId));
          return res.status(412).send({status : 'error' , message : 'contact already exists or you are trying to add yourself as a contact'});
      }else{
        user.contacts.push({contact : contact , userId : isContact.userId});
      
      user.save();
      return res.status(200).send({status : 'ok' , message : 'contacts updated successfully' , data : user})
        }
      }
    }
    else{
      return res.status(411).send({status : 'error' , message : 'user not found' , users : users})
    }
  }
  catch(err){
    console.log(err)
    return res.status(500).send({status : 'error' , message : 'server error'})
  }
}

exports.deleteContact = async (req , res , next)=>{
  const {email , contact} = req.body;
  console.log(email , contact);

  try{
    const user = await User.findOne({email : email});
    console.log(user);
    if(user.contacts.some(c => c.contact === contact)){
      console.log('Contact already exists' , 'index of the contact is ' , user.contacts.findIndex(c => c.contact === contact));
      user.contacts.splice(user.contacts.findIndex(c => c.contact === contact) , 1);
      user.save();
      return res.status(200).send({status : 'ok' , message : 'contact deleted successfully' , data : user})
  }
  else{
    return res.status(411).send({status : 'error' , message : 'contact does not exists'});
  }
  }
  catch(err){
    console.log(err)
    return res.status(500).send({status : 'error' , message : 'server error'})
  }
}