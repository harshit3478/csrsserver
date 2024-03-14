const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    }
});
const Admin = mongoose.model('Admins', AdminSchema);
module.exports = { Admin };