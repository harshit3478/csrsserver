const {model, Schema} = require('mongoose')

const UserSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    hall:{
        type: String,
        required: false,
    },
    address:{
        type: String,
        required: false,
    },
    phone:{
        type:String,
        required: true,
    },
    rollNo:{
        type: String,
        required: true,
    },
    imageUrl:{
        type: String,
    },
    deviceToken:{
        type: String,
        required: true,
    },
})

module.exports.UserSchema = UserSchema;
module.exports.User = model('Users', UserSchema);