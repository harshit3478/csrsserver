const sgMail = require('@sendgrid/mail')

require('dotenv').config()


exports.verifyMail = async(req, res, next) => {
    const { to } = req.body 
    sgMail.setApiKey(process.env.API_KEY)
    const otp = Math.floor(Math.random() * 1000000)
    console.log(otp)
   
        const message = {
            to: to,
            from: {
                name: 'Datsol solutions',
                email: 'harshit@kgpian.iitkgp.ac.in',
            },
            subject: "Confirm your registration ",
            text: `This mail is to confirm your mail id for registration on website kgp-connect , your otp is  :${otp}  `,
            html: `<h1 style='align-text:center; margin:20px' > Now Help is just one tap away </h1>
            <p> this mail is to confirm your mail id for registration on Datsol SOS app  , your otp is : ${otp} </p>`
        }
        sgMail.send(message).then((res) => {
            console.log('message sent ....')
        }).catch((err) => { console.log(err) })
        res.status(200).send({otp : otp});
    
}