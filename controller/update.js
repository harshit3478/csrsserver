const { uploadToCloudinary, removeFromCloudinary } = require('./cloudinary.js');
const { User } = require('../mongoose/User.js');
exports.update = async(req, res) => {
    const {email , name  } = req.body;
    console.log(" email is ", email)
    try{
      const user = await User.findOne({email : email});
      if(!user) return res.status(411).send({status : 'error' , message : 'user not found',  code : -1});
        const data = await uploadToCloudinary(req.files.image , "user-images");
      const updatedUser = await User.updateOne({
        email : email ,
      },{
        $set : {
          imageUrl : data.url,
          publicId : data.public_id,
          username : name
        }
      });
      res.status(200).send({status : 'success' , message : 'user updated',  code : 1});
    }
    catch(err){
      res.status(500).send({status : 'error' , message : 'server error',  code : -3});
    }
  }

        
