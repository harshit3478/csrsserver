const userServices = require('./user.services');
const responses = require('../../../utility/responses');

const updateProfile = async (req, res) => {
    try{
        // handle single image upload here
        if(req.file){
            const image = req.file.location;
            req.body= {...req.body , imageUrl:image}
            console.log('image is:', image);
        }
        const result = await userServices.updateProfile({body:req.body});
        if(result.status && result.status !== 200){
            return responses.generateResponse(res, false, result.message, result.status);
        }
        return responses.successResponse(res, result.data);

    }catch(err){
        console.log(err);
        return responses.internalFailureResponse(res, err);
    }
}
const notificationAPI = async (req, res)=>{
    try{
        const result = await userServices.notificationAPI({body:req.body});
        if(result.status && result.status !== 200){
            return responses.generateResponse(res, false, result.message, result.status);
        }
        return responses.successResponse(res, result.data);

    }catch(err){
        console.log(err);
        return responses.internalFailureResponse(res, err);
    }
}
module.exports = { updateProfile , notificationAPI }