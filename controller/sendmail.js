const sgMail = require('@sendgrid/mail')

require('dotenv').config()


exports.verifyMail = async(email , otp) => {
    
    sgMail.setApiKey(process.env.API_KEY)
    
   
        const message = {
            to: email,
            from: {
                name: 'Datsol solutions',
                email: 'harshit@kgpian.iitkgp.ac.in',
            },
            subject: "OTP for registration on CSRS DATSOL",
            text: `This mail is to confirm your mail id for registration on website kgp-connect , your otp is  :${otp}  `,
            html: `<h1 style='align-text:center; margin:20px; color:green' > Now Help is just one tap away </h1>
            <p> this mail is to confirm your mail id for registration on CSRS Datsol , your otp is : ${otp} </p>`
        }
        sgMail.send(message).then((res) => {
            console.log('message sent ....')
        }).catch((err) => { console.log(err) })
        // res.status(200).send({otp : otp});
    
}