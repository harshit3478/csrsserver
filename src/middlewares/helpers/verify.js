const { client } = require("../../../redis");
const speakeasy = require("speakeasy");

exports.verify = async(otp , emailOrPhone) => {

    try {
     
        if (!client.isOpen) throw new Error("Redis client is not open");
        const secret = await client.get( emailOrPhone , (err, res) => {
            if (err) console.log(err);
            console.log(res);
            throw new Error("Redis client error" , err);
        });
        console.log('secret is :', secret);
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "base32",
            token: otp,
            window: 3 // Allow 1-time step tolerance in verification
        })
        return verified;
    }
    catch (e) {
        console.log("error in verifyOTP", e.message);
        throw new Error(e.message);
    }
};