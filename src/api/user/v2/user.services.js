const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user.schema");
const { OAuth2Client } = require("google-auth-library");
const { id } = require("date-fns/locale");
const sendNotification = require("../../../middlewares/helpers/notification");

const signUpWithPassword = async ({ body }) => {
  try {
    const { email, phone, name, rollNo, password, deviceToken } = body;

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log("user found is ", user);
    if (user) {
      return { status: 409, message: "user already exists" };
    }
    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const lowerCaseEmail = email.toLowerCase();
    const newUser = await User.create({
      email: lowerCaseEmail,
      phone,
      username: name,
      rollNo,
      password: hashedPassword,
      deviceToken,
    });
    return {
      status: 200,
      data: {
        data: {
          id: newUser._id,
          email: newUser.email,
          phone: newUser.phone,
          username: newUser.username,
          rollNo: newUser.rollNo,
          deviceToken: newUser.deviceToken,
          imageUrl: newUser.imageUrl,
        },
        token: jwt.sign(
          {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            deviceToken: newUser.deviceToken,
            phone: newUser.phone,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "90d",
          }
        ),
      },
    };
  } catch (error) {
    console.log("sign up ", error);
    return { status: 500, message: error.message };
  }
};

const loginWithPassword = async ({ body }) => {
  try {
    const { email, password } = body;
    console.log("email is ", email);
    console.log("password is ", password);
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return { status: 400, message: "User does not exist" };
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return { status: 400, message: "Password is incorrect" };
    return {
      status: 200,
      data: {
        data: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          username: user.username,
          rollNo: user.rollNo,
          deviceToken: user.deviceToken,
          imageUrl: user.imageUrl,
          hall : user.hall,
          address : user.address
        },
        token: jwt.sign(
          {
            id: user._id,
            username: user.username,
            email: user.email,
            deviceToken: user.deviceToken,
            phone: user.phone,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "90d",
          }
        ),
      },
    };
  } catch (error) {
    console.log("login ", error);
    return { status: 500, message: error.message };
  }
};

const loginWithGoogle = async ({ body }) => {
  try {
    const clientId = process.env.GOOGLE_WEB_CLIENT_ID;
    const client = new OAuth2Client(clientId);
    const { idToken } = body;
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: clientId, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();

    // You can use the payload information (e.g., user ID, email) to authenticate the user
    console.log("Verified ID Token Payload:", payload);
    // if email from payload exists in db, login user
    const user = await User.findOne({ email: payload.email });
    if (user) {
      return {
        status: 200,
        data: {
          // exclude password from user object
          data: {
            id: user._id,
            email: user.email,
            phone: user.phone,
            username: user.username,
            rollNo: user.rollNo,
            deviceToken: user.deviceToken,
            imageUrl: user.imageUrl,
            hall : user.hall,
            address : user.address
          },
          token: jwt.sign(
            {
              id: user._id,
              username: user.username,
              email: user.email,
              deviceToken: user.deviceToken,
              phone: user.phone,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "90d",
            }
          ),
        },
      };
    }
    // else return user not found
    return { status: 400, message: "User not found" };
  } catch (err) {
    console.log("login with google ", err);
    return { status: 500, message: err.message };
  }
};

const updatePassword = async ({ body }) => {
  try {
    const { email, password } = body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return { status: 400, message: "User does not exist" };
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    user.password = hashedPassword;
    await user.save();
    return { status: 200, message: "Password updated successfully" };
  } catch (error) {
    console.log("update password ", error);
    return { status: 500, message: error.message };
  }
};

const updateProfile = async ({ body }) => {
  try {
    const { email, phone, name, rollNo, imageUrl, hall , address } = body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return { status: 400, message: "User does not exist" };
    user.phone = phone;
    user.username = name;
    user.rollNo = rollNo;
    if(imageUrl) user.imageUrl = imageUrl;
    user.hall = hall;
    user.address = address;
    await user.save();

    return {
      status: 200,
      message: "Profile updated successfully",
      data: {
        data: {
          id: user._id,
          email: user.email,
          phone: user.phone,
          username: user.username,
          rollNo: user.rollNo,
          deviceToken: user.deviceToken,
          imageUrl: user.imageUrl,
          hall: user.hall,
          address: user.address
        },
        token: jwt.sign(
          {
            id: user._id,
            username: user.username,
            email: user.email,
            deviceToken: user.deviceToken,
            phone: user.phone,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "90d",
          }
        ),
      },
    };
  } catch (error) {
    console.log("update profile ", error);
    return { status: 500, message: error.message };
  }
};

const notificationAPI = async ({ body }) => {
  try {
    const { token , title , message , lat, long }  = body;
    sendNotification(token , title , message , lat , long);
    return { status: 200, message: "Notification sent successfully" };
  }
  catch(error){
    console.log("notification ", error);
    return { status: 500, message: error.message };
  }
}
module.exports = {
  signUpWithPassword,
  loginWithPassword,
  loginWithGoogle,
  updatePassword,
  updateProfile,
  notificationAPI
};
