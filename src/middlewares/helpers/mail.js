const { createTransport } = require("nodemailer");
const { client } = require("../../../redis");
const speakeasy = require("speakeasy");
const transporter = createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_KEY,
  },
});


exports.sendMail = async (to, isRegister) => {
  try {
    console.log('value of the to is ', to);
    let otp;
    let secret;

    if (client.isOpen) {
      const existingSecret = await client.get(to);
      if (existingSecret) {
        secret = { base32: existingSecret };
        otp = speakeasy.totp({
          secret: existingSecret,
          encoding: 'base32'
        });
      }
    }

    if (!otp) {
      secret = speakeasy.generateSecret({ length: 20 });
      otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
      });

      if (!client.isOpen) {
        throw new Error("Redis client is not open");
      }

      await client.set(
        to,
        secret.base32,
        { EX: process.env.OTP_EXPIRE_TIME },
        (err, res) => {
          if (err) {
            console.log("error in setting redis key", err);
            throw new Error("Redis client error", err);
          }
        }
      );
    }

    console.log('value for the key is ', await client.get(to));

    const mailOptions = {
      from: `Datsol solutions <${process.env.MAIL_USER}> `,
      to: to,
      subject: isRegister
        ? `OTP for registration on CSRS DATSOL `
        : `OTP for login on CSRS DATSOL`,
      text: isRegister
        ? `This mail is to confirm your mail id for registration on csrs app , your otp is  :${otp}  `
        : `This mail is to confirm your mail id for login on csrs app , your otp is  :${otp}  `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        throw new Error(error);
      } else {
        console.log("Email sent: " + info.response);
        return;
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
