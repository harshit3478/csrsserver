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

exports.sendNotification = (req , res , next)=>{
    const {userIDs, lang , long, content } = req.body;
    console.log(userIDs)
  
   var message = {
      app_id: process.env.ONESIGNAL_APP_ID,
      contents: { en: content},
      // included_segments: ['All'],
      include_player_ids: userIDs,
  
      content_available: true,
      android_channel_id : "b10f20a7-642a-499a-9e68-de9b340452cb",
      small_icon: "ic_stat_onesignal_default",
      data : {
        "type" : "redirect",
        "langitude" : lang,
        "longitude" : long,
      },
      // big_picture : "https://miro.medium.com/max/1400/1*vrm-FxGlvWnI5LMXqCUSCw.jpeg",
      // large_icon : "https://tse4.mm.bing.net/th?id=OIP._gPkZF9gSApIFuuOYHoWEwHaEK&pid=Api&P=0&h=180",
      android_accent_color : "00bfff",
      android_led_color : "00bfff",
      android_visibility : 1,
      color : "8a2be2",
    };
    SendNotificationFunction(message , (err , data)=>{
      if(err) {
        return next(err);
      }
      return res.status(200).send({status : 'ok' , message : 'notification sent successfully' , data : data , })
    });
   
  }
  async function SendNotificationFunction(data , callback){
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