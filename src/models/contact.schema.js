const {model , Schema} = require('mongoose');

const ContactSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    name: { type: String, required: [true, 'Contact name is required'] },
    phone: { type: String, required: [true, 'Contact phone is required']},
    imageUrl: { type: String },
    isUser: { type: Boolean, default: false },
    deviceToken: { type: String },
});
module.exports.ContactSchema = ContactSchema;
module.exports.Contact = model('Contact', ContactSchema);
