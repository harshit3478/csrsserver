const jwt = require("jsonwebtoken");

const AuthToken = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization.split(" ")[1];
    const { password } = req.body;

    // Verify token
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user  = decodedData;
    next();
  } catch (err) {
    console.error("Error in checkToken middleware:", err);
    return res.status(401).json({
      message: "Invalid token or something went wrong",
    });
  }
};

module.exports = AuthToken;