const https = require("https");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const region ="ap-south-1" ;
const sns = new SNSClient({ region });

async function PublishPushNotification(message, endpointARN) {
    // format message
    message = formatMessage(message?.title, message?.body);
    console.log(message);
    try {
        // Set params
        const publishParams = {
            Message: message,
            TargetArn: endpointARN,
        };
        // Send push notification
        const publishData = await sendPushNotification(sns, publishParams);
        console.log("MessageId is " + publishData.MessageId);
        console.log(publishData);
    } catch (err) {
        console.error(err, err.stack);
    }
  }
  
  function formatMessage(title, body) {
      const payload = {
          GCM: JSON.stringify({
              notification: {
                  title,
                  body,
              },
          }),
      };
      return JSON.stringify(payload);
  }
  async function sendPushNotification(sns, params) {
      return await sns.send(new PublishCommand(params));
  }
exports.sendNotification = async(req , res)=>{
  
  try{
  const message = {
    title: req.body.title || "Sample Title",
    body: req.body.body || "Sample Body",
  }
  const targetArn = "arn:aws:sns:ap-south-1:038681426510:app/GCM/campus-security-response-system";
  await PublishPushNotification(message, targetArn);
  return res.status(200).send({status : 'ok' , message : 'notification sent successfully' , code : 1 })
}catch(e){
  console.log('error in sending notification is : ', e);
  return res.status(500).send({status : 'error' , message : 'server error: ' + e , code : -1})
}
}

// exports.sendNotification = (req , res , next)=>{
//     const {userIDs, lang , long, content } = req.body;
//     console.log(userIDs)
  
//    var message = {
//       app_id: process.env.ONESIGNAL_APP_ID,
//       contents: { en: content},
//       // included_segments: ['All'],
//       include_player_ids: userIDs,
  
//       content_available: true,
//       android_channel_id : "b10f20a7-642a-499a-9e68-de9b340452cb",
//       small_icon: "ic_stat_onesignal_default",
//       data : {
//         "type" : "redirect",
//         "langitude" : lang,
//         "longitude" : long,
//       },
//       // big_picture : "https://miro.medium.com/max/1400/1*vrm-FxGlvWnI5LMXqCUSCw.jpeg",
//       // large_icon : "https://tse4.mm.bing.net/th?id=OIP._gPkZF9gSApIFuuOYHoWEwHaEK&pid=Api&P=0&h=180",
//       android_accent_color : "00bfff",
//       android_led_color : "00bfff",
//       android_visibility : 1,
//       color : "8a2be2",
//     };
//     SendNotificationFunction(message , (err , data)=>{
//       if(err) {
//         return next(err);
//       }
//       return res.status(200).send({status : 'ok' , message : 'notification sent successfully' , data : data , })
//     });
   
//   }
//   async function SendNotificationFunction(data , callback){
//     var headers = {
//       "Content-Type": "application/json; charset=utf-8",
//       "Authorization" : `Basic ${process.env.ONESIGNAL_API_KEY}`
//     }
  
//     var options = {
//       host: "onesignal.com",
//       port: 443,
//       path: "/api/v1/notifications",
//       method: "POST",
//       headers: headers
//     }; 
  
//     var req = https.request(options, function(res) {  
//       res.on('data', function(data) {
//         console.log("Response:");
//         console.log(JSON.parse(data));
//         callback(null , JSON.parse(data))
//       });
//     });
//     req.on('error', function(e) {
//       console.log("ERROR:");
//       console.log(e);
//       return callback({
//         message : e });
//     });
//     req.write(JSON.stringify(data));
//     req.end();
//   }