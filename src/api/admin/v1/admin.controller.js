const responses = require("../../../utility/responses")
const adminServices = require("./admin.services");

const login = async (req, res) => {
  try {
    const result = await adminServices.login(req);
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

const getAdmin = async (req, res) => {
  try {
    // console.log(req.body,  ' req .header' , req.header);
    const result = await adminServices.getCurrentUser(req);
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
    login,
    getAdmin,
    };