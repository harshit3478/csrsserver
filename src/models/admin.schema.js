const {model , Schema } = require('mongoose')

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    }
});

module.exports.adminSchema = adminSchema;
module.exports.Admin = model('Admins', adminSchema);