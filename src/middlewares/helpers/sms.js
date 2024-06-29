
var AWS = require("aws-sdk");
const { client } = require("../../../redis");
const speakeasy = require("speakeasy");
AWS.config.update({ region: "ap-south-1" });

exports.sendSMS = async (phone, isRegister) => {

  var attributeParams = {
    attributes: {
      DefaultSMSType: "Promotional",
    },
  };
try{

    const secret = speakeasy.generateSecret({ length: 20 });
    // console.log(secret);
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
    });
    // console.log(otp, 'secret base 32 is', secret.base32);
    // save the secret key in the user object or database
    if (!client.isOpen)
        throw new Error("Redis client is not open");
    await client.set(
      phone,
      secret.base32,
      { EX: process.env.OTP_EXPIRE_TIME },
      (err, res) => {
        if (err) {
          console.log("error in setting redis key", err);
          throw new Error("Redis client error" , err);
        }
      }
    );


  var setSMSTypePromise = new AWS.SNS({ apiVersion: "2010-03-31" })
    .setSMSAttributes(attributeParams)
    .promise();
  setSMSTypePromise
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.error(err, err.stack);
    });
  
    var params = {

      Message: isRegister ? "Thank you for registering with us. your OTP is : " + otp : "Thanks for using CSRS APP. Your OTP is : " + otp,
      PhoneNumber: "+91" + phone,
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({ apiVersion: "2010-03-31" })
      .publish(params)
      .promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise
      .then(function (data) {
        console.log("MessageID is " + data.MessageId, "data is ", data);
        return ;
      })
      .catch(function (err) {
        console.error(err, err.stack);
        throw new Error(err);
      });

    }catch(e){
      console.log('error in sending sms is : ', e);
      throw new Error(e);
    }
 
}




