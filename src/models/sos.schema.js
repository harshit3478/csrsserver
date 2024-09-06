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
        type: String,
        default: new Date().toLocaleString('en-IN') // Store current time
    },
    resolvedOn: {
        type: String,
    },
    timeTaken: {
        type: String,
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
    