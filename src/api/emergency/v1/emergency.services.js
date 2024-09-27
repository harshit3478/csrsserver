const { client } = require("../../../../redis");
const io = require("../../../../socketConfig");
const sendNotification = require("../../../middlewares/helpers/notification");
const { Contact } = require("../../../models/contact.schema");
const { SOS } = require("../../../models/sos.schema");
const { User } = require("../../../models/user.schema");
const date = require('date-fns')
const { differenceInMilliseconds, parseISO } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');
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
      JSON.stringify(emergency),
      "EX",
      7776000
    );
    
    if (io) {
      // const newEmergency = {...emergency , user}
      io.emit("emergency-created", { ...emergency.toObject(), user });
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
        emergencies.push(emergenciesInRedis[i]);
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

    const emergency = await SOS.findOne({ _id: id });
    if (!emergency) {
      return { status: 400, message: "Emergency does not exist" };
    }
    const user = await User.findOne({ email: emergency.email });

    const contacts = await Contact.find({ userId: user._id });
    console.log({ ...emergency._doc, user: user, contacts: contacts} )
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
    console.log("created on " , emergency.createdOn);
    const resolvedOn = Date.now();
    console.log("resolvedOn is ", resolvedOn);
    const timeTakenMs = differenceInMilliseconds(resolvedOn, emergency.createdOn)/1000;
    
    console.log(timeTakenMs);
    const updatedEmergency = await SOS.findOneAndUpdate(
      { _id: id },
      {
        status: "Resolved",
        sensitivity,
        description,
        resolvedOn: resolvedOn,
        timeTaken: timeTakenMs,
        respondedBy,
      },
      { new: true }
    ).lean().exec();

    const user = await User.findOne({ email : emergency.email });
    sendNotification(
      user.deviceToken,
      "Emergency Resolved - control room",
      `Your emergency has been resolved by ${respondedBy} in ${parseInt(timeTakenMs/60)} minutes`,
    );

    if (updatedEmergency) {
      await client.set(
        `emergency:${updatedEmergency._id}`,
        JSON.stringify(updatedEmergency),
        'EX',
        7776000
      );
    }

    return { status: 200, data: updatedEmergency };
  } catch (error) {
    console.error("Resolve emergency error:", error);
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