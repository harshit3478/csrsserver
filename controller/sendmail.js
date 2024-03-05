// const sgMail = require('@sendgrid/mail')

// require('dotenv').config()


// exports.verifyMail = async(email , otp) => {
    
//     sgMail.setApiKey(process.env.API_KEY)
    
   
//         const message = {
//             to: email,
//             from: {
//                 name: 'Datsol solutions',
//                 email: 'harshit@kgpian.iitkgp.ac.in',
//             },
//             subject: "OTP for registration on CSRS DATSOL",
//             text: `This mail is to confirm your mail id for registration on website kgp-connect , your otp is  :${otp}  `,
//             html: `<h1 style='align-text:center; margin:20px; color:green' > Now Help is just one tap away </h1>
//             <p> this mail is to confirm your mail id for registration on CSRS Datsol , your otp is : ${otp} </p>`
//         }
//         sgMail.send(message).then((res) => {
//             console.log('message sent ....')
//         }).catch((err) => { console.log(err) })
//         // res.status(200).send({otp : otp});
    
// }

const { createTransport } = require('nodemailer');

const transporter = createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY,
    },
});

exports.verifyMail = async(to, otp) => {
    const mailOptions = {
        from: `Datsol solutions <${process.env.MAIL_USER}> `,
        to: to,
        subject: `OTP for registration on CSRS DATSOL`,
        text:  `This mail is to confirm your mail id for registration on website kgp-connect , your otp is  :${otp}  `,
    };
    
     transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
    
}