const Joi = require('joi');



const authSchemas = {
    Admin : Joi.object({
        name : Joi.string().min(4).required(),
        password : Joi.string().min(6).required()
    }),
    User : Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).required(),
        rollNo: Joi.string().required(),
        imageUrl: Joi.string(),
        deviceToken: Joi.string().required(),
    }),
    
    SignUpWithEmail : Joi.object({
        email: Joi.string().email().required()
    }),
    SignUpWithPhone: Joi.object({
        phone: Joi.string().min(10).required()
    }),
    Login: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required()
    }),
    Verify: Joi.object({
        emailOrPhone: Joi.string().required(),
        otp: Joi.string().required()
    }),
}

const authSchemasV2= {
    signup : Joi.object({
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).required(),
        name: Joi.string().required(),
        rollNo: Joi.string().required(),
        password: Joi.string().required(),
        deviceToken: Joi.string().required()
    }),
    loginWithPassword : Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required()
    }),
    loginWithGoogle : Joi.object({
        idToken : Joi.string().required()
    }),
    updatePassword : Joi.object({
        email : Joi.string().email().required(),
        password : Joi.string().required()
    }),

    
}

const userSchemasV2 = {
    updateProfile : Joi.object({
        email: Joi.string().email().required(),
        phone: Joi.string().length(10).required(),
        name: Joi.string().required(),
        rollNo: Joi.string().required(),
        imageUrl: Joi.string().required()
    })
}
const contactSchemas = {
    getContacts: Joi.object({
        id: Joi.string().required()
    }),
    addContact: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        phone: Joi.string().required()
    }),
    updateContact: Joi.object({
        id: Joi.string().required(),
    }),
    deleteContact: Joi.object({
        id: Joi.string().required()
    })  
}

const EmergencySchemas = {
    addEmergency : Joi.object({
        email : Joi.string().email().required(),
        latitude : Joi.string().required(),
        longitude : Joi.string().required(),
        landmark : Joi.string().required(),
    }),
    updateStatus : Joi.object({
        id : Joi.string().required(),
        status : Joi.string().required()
    }),
    resolveEmergency : Joi.object({
        id : Joi.string().required(),
        sensitivity : Joi.string().required(),
        description : Joi.string().required(),
        respondedBy : Joi.string().required()
    }),
}

const adminSchemas = {
    login : Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(4).required()
    })
}
module.exports = { authSchemas ,authSchemasV2,userSchemasV2, contactSchemas , EmergencySchemas ,adminSchemas}