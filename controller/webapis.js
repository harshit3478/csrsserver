const {Emergency} = require('../mongoose/sos');
exports.newEmergency = async (req, res) => {
    const { phone, lat, long, message } = req.body;
    // if (phone && lat && long && message) {
    //     const user = await User.findOne({ phone: phone });
    //     if (user) {
    //         const emergency = new Emergency({
    //             name: user.username,
    //             status: "pending",
    //             email: user.email,
    //             phone: phone,
    //             location: [
    //                 {
    //                     latitude: lat,
    //                     longitude: long,
    //                 },
    //             ],
    //             imageUrl: message,
    //         });
    //         emergency.save();
    //         return res.status(200).send({ status: "ok", message: "emergency registered" });
    //     }
    //     else {
    //         return res.status(404).send({ status: "error", message: "user not found" });
    //     }
    // }
    // else {
    //     return res.status(411).send({ status: "error", message: "phone number or location not found" });
    // }
    try {
        
        await Emergency.create(req.body);
        res.status(200).send({ status: "ok", message: "emergency registered" });
    } catch (error) {
        console.log(error , "error in newEmergency");
    }

}
const getEmergency = async (req, res) => {
    const emergency = await Emergency.find();
    return res.status(200).send({ status: "ok", data: emergency });
}
