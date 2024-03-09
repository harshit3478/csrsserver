const mongoose = require("mongoose");
const moment = require('moment-timezone');
const EmergencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },

  createdOn: {
    type: Date,
    default:moment().tz('Asia/Kolkata').format(),
  },
  resolvedOn: {
    type: Date,
    required: false,
  },
  timeTakenToResolve: {
    type: String,
    required: false,
  },
});

const Emergency = mongoose.model("emergency", EmergencySchema);
module.exports = { Emergency };
