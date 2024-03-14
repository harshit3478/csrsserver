const { User } = require('../mongoose/User');
const { Emergency } = require('../mongoose/sos');
const moment = require('moment-timezone');
const  io  = require('../index');
const indianTimeZone = 'Asia/Kolkata'; // Indian Standard Time (IST)
exports.newEmergency = async (req, res) => {

    try {
        const { latitude, longitude, landmark, status } = req.body;
        console.log("email is : " , req.body.email);
        const user = await User.findOne({email : req.body.email});
        // console.log("user is : ", user)
        const emergency = await Emergency.create({
            latitude: latitude,
            longitude: longitude,
            landmark: landmark,
            status: status,
            user: user,
        });
       //check if socket.io is connected and then emit the event
         if (io) {
            io.emit('emergency-created', emergency);
            console.log('emergency created and emitted');
            // console.log(io);
            //  io.on('connection', (socket) => {
            //         console.log("socket.io is connected");
            //         console.log('a user connected');
            //         socket.emit('emergency-created',emergency);

            // });
        }

        res.status(200).send({ status: "ok", message: "emergency registered", data: emergency, code: 1 });
    } catch (error) {
        console.log(error, "error in newEmergency is : ");
        res.status(500).send({ status: "error", message: "error in newEmergency is : " + error.message, code: -1 });
    }
}
exports.getEmergencies = async (req, res) => {
    try {
        const emergency = await Emergency.find();
        if(!emergency) {
            return res.status(411).send({ status: "error", message: "no emergency found", code: -2 });
        }
        // console.log("emergency is fetched " );
        return res.status(200).send({ status: "ok", data: emergency, code: 1 });
    } catch (error) {
        console.log('error in getEmergencies is : ', error);
        res.status(411).send({ status: "error", message: "error in getEmergencies is : " + error.message, code: -2 });
    }
}

exports.resolveEmergency = async (req, res) => {
    try {
        const emergency = await Emergency.findOne({ _id: req.body.id });

        if (!emergency) {
            return res.status(411).send({ status: "error", message: "emergency not found", code: -2 });
        }

        const timeTakenToResolve = Math.abs(Date.now() - emergency.createdOn);
        const timeString = new Date(timeTakenToResolve).toISOString().substr(11, 8);
        
        // Convert current time to IST
        const resolvedOnIST = moment().tz(indianTimeZone).toDate();

        const updatedEmergency = await Emergency.updateOne({ _id: req.body.id }, { 
            $set: { 
                status: "resolved", 
                resolvedOn: resolvedOnIST, 
                timeTakenToResolve: timeString 
            } 
        });
        
        return res.status(200).send({ status: "ok", message: "emergency resolved", code: 1 });
    } 
    catch (error) {
        console.log('error in resolveEmergency is : ', error);
        res.status(500).send({ status: "error", message: "error in resolveEmergency is : " + error.message, code: -1 });
    }
}


exports.updateSensitivity= async(req, res) => {
    const { id , sensitivity } = req.body;
    console.log(" id is and sensitivity is ", id , sensitivity);
    try {
        const emergency = await Emergency.findOne({_id : id});

        if (!emergency) {
            return res.status(411).send({status: 'error', message: 'emergency not found', code: -1});
        }
        
        emergency.sensitivity = sensitivity; // Use assignment operator (=) instead of comparison operator (==)
        
        await emergency.save(); // Save the updated emergency object
        
        console.log("updated emergency is ", emergency);
        res.status(200).send({status: 'success', message: 'sensitivity updated', code: 1});
    } catch (error) {
        console.log('error in updateSensitivity is : ', error);
        res.status(500).send({status: 'error', message: 'server error', code: -3});
    }
}
  exports.updateDescription = async (req, res) => {
    const { id , description } = req.body;
    console.log(" id is ", id)
    try{
      const emergency = await Emergency.findOne({_id : id});
      if(!emergency) return res.status(411).send({status : 'error' , message : 'emergency not found',  code : -1});

        emergency.description = description;
        await emergency.save(); // Save the updated emergency object
      console.log("updated emergency is ", emergency)
      res.status(200).send({status : 'success' , message : 'description updated',  code : 1});
    }catch(error){
      console.log('error in updateDescription is : ', error);
      res.status(500).send({status : 'error' , message : 'server error',  code : -3});
    
    }
  }
  exports.updateEmergency = async (req, res) => {
    const { id , sensitivity ,description } = req.body;
    console.log(" id is ", id)
    try{
      const emergency = await Emergency.findOne({_id : id});
      if(!emergency) return res.status(411).send({status : 'error' , message : 'emergency not found',  code : -1});
        
     emergency.sensitivity = sensitivity; // Use assignment operator (=) instead of comparison operator (==)
        emergency.description = description;

      await emergency.save(); // Save the updated emergency object
      console.log("updated emergency is ", emergency)
      res.status(200).send({status : 'success' , message : 'emergency updated',  code : 1});
    }catch(error){
      console.log('error in updateEmergency is : ', error);
      res.status(500).send({status : 'error' , message : 'server error',  code : -3});
    }
  }