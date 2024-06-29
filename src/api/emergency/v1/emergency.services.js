const  io = require("../../../../socketConfig");
const { SOS } = require("../../../models/sos.schema");
const { User } = require("../../../models/user.schema");

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

    // Check if sos is null or not after the update
    if (!sos) {
      return { status: 404, message: 'SOS not found' };
    }

    return { status: 200, data: sos };
  } catch (error) {
    console.log("update status ", error);
    return { status: 500, message: error.message };
  }
};

const getEmergencies = async () => {
  try {
    const emergencies = await SOS.find();
    return { status: 200, data: emergencies };
  } catch (error) {
    console.log("get emergencies ", error);
    return { status: 500, message: error.message };
  }
};

const getEmergencyById = async ({ params }) => {
  try {
    console.log(params, "body in get emergency by id")
    const { id } = params;
    const emergency = await SOS.findOne({ _id: id });
    if (!emergency) {
      return { status: 400, message: "Emergency does not exist" };
    }
    return { status: 200, data: emergency };
  } catch (error) {
    console.log("get emergency by id ", error);
    return { status: 500, message: error.message };
  }
};

const resolveEmergency = async ({ body }) => {
    try {
        const { id , sensitivity , description , respondedBy} = body;
        const emergency = await SOS.findOne({ _id: id });
        if (!emergency) {
            return { status: 400, message: "Emergency does not exist" };
        }
        const updatedEmergency = await SOS.findOneAndUpdate(
            { _id: id },
            { 
              status: "Resolved",
              sensitivity: sensitivity,
              description: description,
              resolvedOn: new Date(),
              timeTaken: new Date() - emergency.createdOn,
              respondedBy: respondedBy
            },
            { new: true }
          ).exec();
      
          // Convert time fields to Indian time standard strings
          const resolvedOnIndianTime = updatedEmergency.resolvedOn.toLocaleString('en-IN');
          const timeTakenMs = new Date() - emergency.createdOn;
            const timeTakenSeconds = Math.floor((timeTakenMs / 1000) % 60);
            const timeTakenMinutes = Math.floor((timeTakenMs / (1000 * 60)) % 60);
            const timeTakenHours = Math.floor(timeTakenMs / (1000 * 60 * 60));
            const timeTakenString = `${timeTakenHours} hours, ${timeTakenMinutes} minutes, ${timeTakenSeconds} seconds`;
          const createdOnIndianTime = updatedEmergency.createdOn.toLocaleString('en-IN');
          return { status: 200, data: { ...updatedEmergency._doc, resolvedOn: resolvedOnIndianTime, timeTaken: timeTakenString , createdOn: createdOnIndianTime } };
    }
    catch (error) {
        console.log("resolve emergency ", error);
        return { status: 500, message: error.message };
    }
}


module.exports = {
  initiateEmergency,
  updateStatus,
  getEmergencies,
  resolveEmergency,
getEmergencyById,
};