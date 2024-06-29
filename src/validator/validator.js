const responses = require("../utility/responses");

const validator = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      return responses.badRequestResponse(res, message);
    }
  };
};
module.exports = validator;
