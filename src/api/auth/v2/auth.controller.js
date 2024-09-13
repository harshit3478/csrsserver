const userServices = require("../../user/v2/user.services");
const responses = require("./../../../utility/responses");

const signUpWithPassword = async (req, res) => {
  try {
    const result = await userServices.signUpWithPassword(req);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const loginWithPassword = async (req, res) => {
  try {
    const result = await userServices.loginWithPassword(req);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status,
        result.data
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const result = await userServices.loginWithGoogle(req);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

const updatePassword = async (req, res) => {
  try {
    const result = await userServices.updatePassword(req);
    if (result.status && result.status !== 200) {
      return responses.generateResponse(
        res,
        false,
        result.message,
        result.status
      );
    }

    return responses.successResponse(res, result.data);
  } catch (err) {
    console.log(err);
    return responses.internalFailureResponse(res, err);
  }
};

module.exports = {
  signUpWithPassword,
  loginWithPassword,
  loginWithGoogle,
  updatePassword,
};
