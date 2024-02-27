const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

exports.userAuth = (req, res, next) => {
  console.log(req.headers.cookies)
    const token = req.cookies.jwt;
  console.log(token)
  try {
    if (token) {

      jwt.verify(token, jwtSecret, (err, decodedToken) => {
        if (err) {
          res.status(401).send({ message: "Not Authorized", error: err });
        } else {
          console.log("decoded token is : ", decodedToken);
          req.user = decodedToken;
          next();
        }
      });
    } else {
      res.status(401).send({ message: "Not Authorized"  , error : 'no token found' });
      // location.assign('/')
      
    }
  } catch (error) {
    console.error("Error:" , error)
    res.status(400).send(error);
  }
  
};