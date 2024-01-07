const mongoose = require('mongoose')
require('dotenv').config()
const UserDetails = new mongoose.Schema(
{
	username : {type : String , required : true , unique:true , minlength:4}, 
	password : {type: String , required : true , minlength:6 },
	email : {type:String , required:true , unique:true 	}

})
const User = mongoose.model("userdetails" , UserDetails);

const Mongo_url = 'mongodb://127.0.0.1:27017/datsol?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3';
module.exports = {Mongo_url , User} 