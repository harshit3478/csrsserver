const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
require('dotenv').config()
const UserDetails = new mongoose.Schema(
	{
		username: { type: String,
			 required: [true , "Name is required"],
			},
		rollNo : { type: String,
			required: [true , "Roll number is required"],
		},
		imageUrl: {
			type: String,
			required: false,
		},
		publicId: {
			type: String,
			required: false,
		},
		email: {
			type: String, required: [true, 'email is required'],
			unique: [true, 'email is already registered'],
			validate: {
				validator: function (v) {
					// Regular expression for email validation
					return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
				},
				message: props => `${props.value} is not a valid email address!`
			}
		},
		userId: { type: String, required: [true, 'user id is required '] },
		phone: {
			type: String,
			validate: {
				validator: function (v) {
					return /^\d{10}$/.test(v);
				},
				message: props => `${props.value} is not a valid phone number!`
			},
		},
		contacts: [
			{
				contact: {
					type: String,
					required: [true, 'Contact is required'],
				},
				userId: {
					type: String,
					required: [true, 'User Id is required'],
				},
			},
		],
	}, {
	virtuals: {
		id: {
			get() {
				return this._id
			}
		}
	},
	toObject: {
		virtuals: true,
		versionKey: false,
		transform: (doc, ret) => {
			delete ret._id
			return ret
		}
	},
	toJSON: {
		virtuals: true,
		versionKey: false,
		transform: (doc, ret) => {
			delete ret._id
			return ret
		}
	}
});
UserDetails.plugin(uniqueValidator, { message: "This {PATH} is already registered" })

const User = mongoose.models.user || mongoose.model("users", UserDetails);

const Mongo_url = process.env.Mongo_Url;
module.exports = { Mongo_url, User } 