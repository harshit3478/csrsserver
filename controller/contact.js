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