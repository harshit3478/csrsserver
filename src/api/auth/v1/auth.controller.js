const userServices = require("../../user/v1/user.services");
const responses = require("./../../../utility/responses");
const signUp = async (req, res) => {
  try {
    const result = await userServices.signUp(req);
    if (result.status && result.status !== 200) {
      return response.generateResponse(
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

const login = async (req, res) => {
  try {
    const result = await userServices.login(req);
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

const loginWithEmail = async (req, res) => {
  try {
    const result = await userServices.loginWithEmail(req);
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

const signUpWithEmail = async (req, res) => {
  try {
    const result = await userServices.signUpWithEmail(req);
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

const signUpWithPhone = async (req, res) => {
  try {
    const result = await userServices.signUpWithPhone(req);
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

const verifyOtp = async (req, res) => {
  try {
    const result = await userServices.verifyOtp(req);
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
  signUp,
  login,
  loginWithEmail,
  signUpWithEmail,
  signUpWithPhone,
  verifyOtp,
};
