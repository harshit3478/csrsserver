const { User } = require('../mongoose/User');
const { Emergency } = require('../mongoose/sos');
const moment = require('moment-timezone');
exports.newEmergency = async (req, res) => {

    try {
        const { latitude, longitude, landmark, status } = req.body;
        console.log("email is : " , req.body.email);
        const user = await User.findOne({email : req.body.email});
        console.log("user is : ", user)
        const emergency = await Emergency.create({
            latitude: latitude,
            longitude: longitude,
            landmark: landmark,
            status: status,
            user: user,
        });
        res.status(200).send({ status: "ok", message: "emergency registered", data: emergency, code: 1 });
    } catch (error) {
        console.log(error, "error in newEmergency is : ");
        res.status(500).send({ status: "error", message: "error in newEmergency is : " + error.message, code: -1 });
    }
}
exports.getEmergencies = async (req, res) => {
    try {
        const emergency = await Emergency.find();
        return res.status(200).send({ status: "ok", data: emergency, code: 1 });
    } catch (error) {
        console.log('error in getEmergencies is : ', error);
        res.status(411).send({ status: "error", message: "error in getEmergencies is : " + error.message, code: -2 });
    }
}

exports.resolveEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findOne({ _id: req.body.id });
        // In hours minutes and seconds
        const timeTakentoResolve = (Date.now() - emergency.createdOn);
        console.log("timeTakentoResolve is : ", timeTakentoResolve);
        const seconds = Math.floor(timeTakentoResolve/1000);
        const minutes = Math.floor(seconds/60);
        const hours = Math.floor(minutes / 60);
        const timeString = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? "0" + minutes : minutes) + ':' + (seconds % 60 < 10 ? "0" + seconds % 60 : seconds % 60);
        const indianTimeZone = 'Asia/Kolkata'; // Indian Standard Time (IST)
        const utcNow = new Date();
        const istDateTime = new Date(utcNow.toLocaleString('en-US', { timeZone: indianTimeZone }));
        console.log("time taken to resolve is : ", istDateTime, Date.now());
        if (emergency) {
            const updatedEmergency = await Emergency.updateOne({ _id: req.body.id }, { $set: { status: "resolved", resolvedOn: istDateTime, timeTakenToResolve: timeString } });
            return res.status(200).send({ status: "ok", message: "emergency resolved", code: 1 });
        }
        else {
            return res.status(411).send({ status: "error", message: "emergency not found", code: -2 });
        }
    }
    catch (error) {
        console.log('error in resolveEmergency is : ', error);
        res.status(500).send({ status: "error", message: "error in resolveEmergency is : " + error.message, code: -1 });
    }
}
