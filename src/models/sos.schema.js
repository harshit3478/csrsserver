const { required } = require('joi')
const {model , Schema} = require('mongoose')

const sosSchema = new Schema({
    email:{
        type: String,
        required: true, 
    },

    status: {
        type: String,
        required: true,
        enum: ['Open', 'Resolved', 'In Progress', 'Pending']
    },
    location: {
        type: {
            latitude: { type: String, required: true },
            longitude: { type: String, required: true },
            landmark: { type: String, required: true },
        },
        required: true
    },
   
    createdOn: {
        type: Date,
        default: Date.now // Store current time
    },
    resolvedOn: {
        type: Date,
        default: null // Default to null if not resolved
    },
    timeTaken: {
        type: Date,
    },
    description: String,
    sensitivity: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    respondedBy: String
})

module.exports.sosSchema = sosSchema;
module.exports.SOS = model('Emergency', sosSchema);
    