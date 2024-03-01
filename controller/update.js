const { uploadToCloudinary, removeFromCloudinary } = require('./cloudinary.js');
const { User } = require('../mongoose/User.js');
exports.updateToken = async(req, res) => {
    const {email , token } = req.body;
    console.log(" email is ", email)
    try{
      const user = await User.findOne({email : email});
      if(!user) return res.status(411).send({status : 'error' , message : 'user not found',  code : -1});
       
      const updatedUser = await User.updateOne({
        email : email ,
      },{
        $set : {
         userId : token
        }
      });
      res.status(200).send({status : 'success' , message : 'user updated',  code : 1});
    }
    catch(err){
      res.status(500).send({status : 'error' , message : 'server error',  code : -3});
    }
  }

        
