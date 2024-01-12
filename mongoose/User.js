const mongoose = require('mongoose')
require('dotenv').config()
const UserDetails = new mongoose.Schema(
{
	username : {type : String , required : true , minlength:4}, 
	password : {type: String , required : true , minlength:6 },
	email : {type:String , required:true , unique:true 	},
	userId : {type:String ,required :true },
	phone : {type:String ,},
	contacts: [
		{
		  contact: {
			type: String, 
			
		  },
		  userId: {
			type: String , 
			
		  },
		},
	  ],

})
const User = mongoose.model("users" , UserDetails);

const Mongo_url = process.env.Mongo_Url;
module.exports = {Mongo_url , User} 