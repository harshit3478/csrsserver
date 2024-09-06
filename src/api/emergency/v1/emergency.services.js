const { client } = require("../../../../redis");
const io = require("../../../../socketConfig");
const { Contact } = require("../../../models/contact.schema");
const { SOS } = require("../../../models/sos.schema");
const { User } = require("../../../models/user.schema");
const date = require('date-fns')
// console.log("io is : ",io);
const initiateEmergency = async ({ body }) => {
  try {
    const { email, latitude, longitude, landmark } = body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return { status: 400, message: "User does not exist" };
    }
    const emergency = await SOS.create({
      email: email,
      location: {
        latitude: latitude,
        longitude: longitude,
        landmark: landmark,
      },
      status: "Pending",
    });
    // put this emergency in the redis for 90 days
    if (!client.isOpen) throw new Error("Redis client is not open");
    await client.set(
      "emergency:" + emergency._id,
      emergency,
      { EX: 7776000 },
      (err, res) => {
        if (err) {
          console.log("error in setting redis key", err);
          throw new Error("Redis client error" , err);
        }
      }
    );
    
    if (io) {
      io.emit("emergency-created", { emergency, user });
      console.log("emergency created and emitted");
    } else {
      console.log("Socket.io is not initialized or emit is not a function");
    }
    return { status: 200, data: emergency };
  } catch (error) {
    console.log("error in initiateEmergency is:", error);
    return { status: 500, message: error.message };
  }
};

const updateStatus = async ({ body }) => {
  try {
    const { id, status } = body;
    // Make sure to await the async operation and use exec() to execute the query
    const sos = await SOS.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    ).exec();
    // find if the emergency exists in redis or not and update it
    if (!client.isOpen) throw new Error("Redis client is not open");
    await client.set("emergency:" + sos._id, sos, { EX: 7776000 }, (err, res) => {
      if (err) {
        console.log("error in setting redis key", err);
        throw new Error("Redis client error" , err);
      }
    }
    );

    // Check if sos is null or not after the update
    if (!sos) {
      return { status: 404, message: "SOS not found" };
    }

    return { status: 200, data: sos };
  } catch (error) {
    console.log("update status ", error);
    return { status: 500, message: error.message };
  }
};

const getEmergencies = async () => {
  try {
    // check if redis has stored the emergencies or not if yes then return them
    if (!client.isOpen) throw new Error("Redis client is not open");
    // not every key is for emergency so we need to check the value of the key
  const emergenciesInRedis = await client.keys("emergency:*");
  

    if (emergenciesInRedis.length > 0) {
      const emergencies = [];
        for (let i = 0; i < emergenciesInRedis.length; i++) {
        emergencies.push(emergency);
      }
    }

    const emergencies = await SOS.find();
    // add user details to each emergency
    for (let i = 0; i < emergencies.length; i++) {
      const user = await User.findOne({ email: emergencies[i].email });
      emergencies[i] = { ...emergencies[i]._doc, user: user };
    }
    return { status: 200, data: emergencies };
  } catch (error) {
    console.log("get emergencies ", error);
    return { status: 500, message: error.message };
  }
};

const getEmergencyById = async ({ params }) => {
  try {
    // console.log(params, "body in get emergency by id")
    const { id } = params;
    // check if the emergency exists in redis or not
    if (!client.isOpen) throw new Error("Redis client is not open");
    const emergencyInRedis = await client.get("emergency:" + id);
    if (emergencyInRedis) {
      return { status: 200, data: emergencyInRedis };
    }

    const emergency = await SOS.findOne({ _id: id });
    if (!emergency) {
      return { status: 400, message: "Emergency does not exist" };
    }
    const user = await User.findOne({ email: emergency.email });

    const contacts = await Contact.find({ userId: user._id });

    return {
      status: 200,
      data: { ...emergency._doc, user: user, contacts: contacts },
    };
  } catch (error) {
    console.log("get emergency by id ", error);
    return { status: 500, message: error.message };
  }
};

const resolveEmergency = async ({ body }) => {
  try {
    const { id, sensitivity, description, respondedBy } = body;
    const emergency = await SOS.findOne({ _id: id });
    if (!emergency) {
      return { status: 400, message: "Emergency does not exist" };
    }
    // Convert time fields to Indian time standard strings
    console.log(emergency.createdOn);
    const resolvedOnIndianTime = new Date().toLocaleString("en-IN");
    const resolvedOnParsed = date.parse(resolvedOnIndianTime , "M/d/yyyy, h:mm:ss a", new Date());
    const createdOnParsed = date.parse(emergency.createdOn , "M/d/yyyy, h:mm:ss a", new Date());
    // emergency.createdOn is in indian local time standard string
    console.log('resolvedOnParsed', resolvedOnParsed)
    console.log('createdOnParsed', createdOnParsed)
    const timeTakenMs = date.differenceInMilliseconds( resolvedOnParsed , createdOnParsed);
    console.log('time diff ' , timeTakenMs)
    const timeTakenSeconds = Math.floor((timeTakenMs / 1000) % 60);
    const timeTakenMinutes = Math.floor((timeTakenMs / (1000 * 60)) % 60);
    const timeTakenHours = Math.floor(timeTakenMs / (1000 * 60 * 60));
    const timeTakenString = `${timeTakenHours} hours, ${timeTakenMinutes} minutes, ${timeTakenSeconds} seconds`;
    const updatedEmergency = await SOS.findOneAndUpdate(
      { _id: id },
      {
        status: "Resolved",
        sensitivity: sensitivity,
        description: description,
        resolvedOn: resolvedOnIndianTime,
        timeTaken: timeTakenString,
        respondedBy: respondedBy,
      },
      { new: true }
    ).exec();
    // update the emergency in redis
    if (!client.isOpen) throw new Error("Redis client is not open");
    await client.set(
      "emergency:" + updatedEmergency._id,
      updatedEmergency,
      { EX: 7776000 },
      (err, res) => {
        if (err) {
          console.log("error in setting redis key", err);
          throw new Error("Redis client error" , err);
        }
      }
    );

    return { status: 200, data: { updatedEmergency } };
  } catch (error) {
    console.log("resolve emergency ", error); 
    return { status: 500, message: error.message };
  }
};

module.exports = {
  initiateEmergency,
  updateStatus,
  getEmergencies,
  resolveEmergency,
  getEmergencyById,
};
