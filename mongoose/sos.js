const mongoose = require("mongoose");

const EmergencySchema = new mongoose.Schema({
  name: {
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
    default: Date.now,
  },
  resolvedOn: {
    type: Date,
    required: false,
  },
});

const Emergency = mongoose.model("emergency", EmergencySchema);
module.exports = { Emergency };
