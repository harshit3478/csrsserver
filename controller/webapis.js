const {Emergency} = require('../mongoose/sos');
exports.newEmergency = async (req, res) => {
    try {
        await Emergency.create(req.body);
        res.status(200).send({ status: "ok", message: "emergency registered" });
    } catch (error) {
        console.log(error , "error in newEmergency is : " );
        res.status(500).send({ status: "error", message: "error in newEmergency is : " + error.message , code : -1}); 
    }

}
exports.getEmergencies = async (req, res) => {
    try {        
        const emergency = await Emergency.find();
        return res.status(200).send({ status: "ok", data: emergency , code : 1 });
    } catch (error) {
        console.log('error in getEmergencies is : ', error);
        res.status(411).send({ status: "error", message: "error in getEmergencies is : " + error.message , code : -2});
    }
}

exports.resolveEmergency = async (req, res) => 
{
    try {
        const emergency = await Emergency.findOne({ _id: req.body.id });
        if (emergency) {
            const updatedEmergency = await Emergency.updateOne({ _id: req.body.id }, { $set: { status: "resolved", resolvedOn: Date.now() } });
            return res.status(200).send({ status: "ok", message: "emergency resolved" , code : 1});
        }
        else {
            return res.status(411).send({ status: "error", message: "emergency not found" , code : -2});
        }
    }
    catch (error) {
        console.log('error in resolveEmergency is : ', error);
        res.status(500).send({ status: "error", message: "error in resolveEmergency is : " + error.message , code : -1});   
    }
}
