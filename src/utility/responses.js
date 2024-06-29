const successResponse = (res, data, message = "success") => {
    return generateResponse(res, true, message, 200, data);
  };
  
  const paginatedResponse = (res, data, total, offset, message = "success") => {
    return successResponse(
      res,
      {
        items: data,
        pagination: {
          total: total,
          offset: offset,
        },
      },
      message
    );
  };
  
  const notFoundResponse = (message) => {
    return generateResponse(res, false, message, 404);
  };
  
  const internalFailureResponse = (res, data) => {
    return generateResponse(res, false, "internal server error", 500, data);
  };
  
  const authFailureResponse = (res, message) => {
    return generateResponse(res, false, message, 401);
  };
  
  const conflictResponse = (res, message) => {
    return generateResponse(res, false, message, 409);
  };
  
  const badRequestResponse = (res, message) => {
    return generateResponse(res, false, message, 400);
  };
  
  const comingSoonResponse = (req, res, next) => {
    return successResponse(res, {}, "Coming soon....");
  };
  
  const generateResponse = (res, isSuccess, message, code, data = null) => {
    const result = {
      isSuccess,
      message,
      code,
      data,
    };
    return res.status(code).json(result);
  };
  
  module.exports = {
    successResponse,
    paginatedResponse,
    internalFailureResponse,
    badRequestResponse,
    authFailureResponse,
    notFoundResponse,
    conflictResponse,
    comingSoonResponse,
    generateResponse,
  };
  