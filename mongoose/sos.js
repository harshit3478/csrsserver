const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },


});

const Emergency = mongoose.model('emergency', EmergencySchema);
module.exports = { Emergency };