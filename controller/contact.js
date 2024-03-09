const jwt = require("jsonwebtoken");
const express = require('express');

const { User } = require("../mongoose/User");
const bcrypt = require("bcryptjs");

require('dotenv').config();
const app = express();

const jwtSecret = process.env.JWT_SECRET;

exports.getContacts = async (req, res, next) => {
  const { email } = req.headers;
  console.log(email)
  try {

    const user = await User.findOne({ email: email });
    console.log(user)
    if (user) {
      return res.status(200).send({ status: 'ok', message: 'contacts fetched successfully', data: user.contacts })
    }
    else {
      return res.status(411).send({ status: 'error', message: 'user not found' })
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ status: 'error', message: 'server error' })
  }
}

exports.updateContacts = async (req, res, next) => {
  const { email, contactname, contactphone } = req.body;
  console.log(email, contactname, contactphone)
  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      const isContactAUser = await User.findOne({ phone: contactphone });
      console.log('is contacts is : ', isContactAUser);
      if (user.contacts.some(c => c.contactphone === contactphone)) {
        console.log('Contact already exists', 'index of the contact is ', user.contacts.findIndex(c => c.contactphone === contactphone));
        return res.status(412).send({ status: 'error', message: 'contact already exists', code: -2 });
      }
      if (isContactAUser) {
        user.contacts.push({ contactName: contactname, contactPhone: contactphone, isUser: true, userId: isContactAUser.userId, contactImageUrl: isContactAUser.imageUrl });

        user.save();
        return res.status(200).send({ status: 'ok', message: 'contacts updated successfully', data: user })
      }
      else {

        user.contacts.push({ contactName: contactname, contactPhone: contactphone, isUser: false, userId: '', contactImageUrl: '' });
        user.save();
        return res.status(200).send({ status: 'ok', message: 'contacts updated successfully', data: user })
      }
    }
    else {
      return res.status(411).send({ status: 'error', message: 'user not found'})
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ status: 'error', message: 'server error' })
  }
}

exports.deleteContact = async (req, res, next) => {
  const { email, contactphone } = req.body;
  console.log(email, contactphone);

  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user.contacts.some(c => c.contactPhone === contactphone)) {
      console.log('Contact already exists', 'index of the contact is ', user.contacts.findIndex(c => c.contactPhone === contactphone));
      user.contacts.splice(user.contacts.findIndex(c => c.contactPhone === contactphone), 1);
      user.save();
      return res.status(200).send({ status: 'ok', message: 'contact deleted successfully', data: user })
    }
    else {
      return res.status(411).send({ status: 'error', message: 'contact does not exists' });
    }
  }
  catch (err) {
    console.log(err)
    return res.status(500).send({ status: 'error', message: 'server error : ' + err })
  }
}