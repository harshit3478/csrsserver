const jwt = require("jsonwebtoken");
const {  verify } = require("../../../middlewares/helpers/verify");
const { User } = require("../../../models/user.schema");
const { sendMail } = require("../../../middlewares/helpers/mail");
const { sendSMS } = require("../../../middlewares/helpers/sms");

const signUp = async ({ body }) => {
  try {
    const user = await User.create(body);
    return { status: 200, data: user };
  } catch (error) {
    console.log("sign up ", error);
    return { status: 500, message: error.message };
  }
};

const login = async ({ body }) => {
  try {
    const { email, otp } = body;

    const user = await User.findOne({ email: email.toLowerCase() })
      
    if (!user) return { status: 400, message: "User does not exist" };
    const verified = await verify(otp, email);
    if (!verified) return { status: 400, message: "OTP is incorrect" };
    return {
      status: 200,
      data: {
        user: user,
        _id: user._id,
        token: jwt.sign(
          {
            id: user._id,
            username: user.username,
            email: user.email,
            imageUrl: user.imageUrl,
            deviceToken: user.deviceToken,
            phone: user.phone,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        ),
      },
    };
  } catch (error) {
    console.log("login ", error);
    return { status: 500, message: error.message };
  }
};


const loginWithEmail = async ({ body }) => {
    try {
        const { email } = body;
        const user = await User.findOne({email:email.toLowerCase()});
        if(!user) return {status:400, message:"User does not exist"};
        
        await sendMail(email , false);
        return {status:200, message:"OTP sent to your email"};
    }
    catch(error){
        console.log("login with email ", error);
        return {status:500, message:error.message};
    }
}

const signUpWithEmail = async ({ body }) => {
    try {
        const { email } = body;
        const user = await User.findOne({email:email.toLowerCase()});
        if(user) return {status:400, message:"User already exists"};

        await sendMail(email , true);
        return {status:200, message:"OTP sent to your email"};
    }
    catch(error){
        console.log("sign up with email ", error);
        return {status:500, message:error.message};
    }
}

const signUpWithPhone = async ({ body }) => {
    try {
        const { phone } = body;
        await sendSMS(phone , true );
        return {status:200, message:"OTP sent to your phone"};
    }
    catch(error){
        console.log("sign up with phone ", error);
        return {status:500, message:error.message};
    }
}

const verifyOtp = async ({ body }) => {
    try {
        const { emailOrPhone, otp } = body;
       const verified =  await verify(otp, emailOrPhone)
            if(!verified)
         return {status:400, message:"OTP is incorrect"};
         return {status:200, message:"OTP verified"};
        
    }
    catch(error){
        console.log("verify otp ", error);
        return {status:500, message:error.message};
    }
}

module.exports = {
  signUp,
  login,
  loginWithEmail,
  signUpWithEmail,
  signUpWithPhone,
  verifyOtp
};
        