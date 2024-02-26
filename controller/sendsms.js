// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set region
AWS.config.update({ region: "ap-south-1" });

exports.sendSMS = async (phone, otp) => {
  // const { phone , otp } = req.body;

  // Create SMS Attribute parameters
  var attributeParams = {
    attributes: {
      /* required */
      // DefaultSMSType: "Transactional" /* highest reliability */,
      DefaultSMSType: "Promotional", /* lowest cost */
    },
  };
try{
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

      Message: "Thank you for registering with us. your otp is : " + otp,
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
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });

    }catch(e){
      console.log('error in sending sms is : ', e);
    }
 
}




