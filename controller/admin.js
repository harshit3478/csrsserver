const { Admin } = require('../mongoose/admin');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
exports.adminLogin = async (req, res) => {
    try {
        const { name, password } = req.body;
        const admin = await Admin.findOne({ name: name });
        if (!admin) {
            return res.status(411).send({ status: "error", message: "admin not found", code: -2 });
        }
        if (admin.password !== password) {
            return res.status(411).send({ status: "error", message: "password is incorrect", code: -2 });
        }
        const maxAge = 96 * 60 * 60 * 100;
        const token = jwt.sign(
            { id: admin._id, name: admin.name },
            jwtSecret,
            {
                expiresIn: maxAge,
            }
        );
        console.log(token);
        res.header("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
        });
        return res.status(200).send({ status: "ok", message: "admin logged in", code: 1 , token : token });
    }
    catch (error) {
        console.log('error in adminLogin is : ', error);
        res.status(500).send({ status: "error", message: "error in adminLogin is : " + error.message, code: -1 });
    }
}

exports.getCurrentAdminUser = async (req, res) => {
    try {
        //decoding the token 
        const token = req.headers.jwt;
        const decoded = jwt.verify(token, jwtSecret);
        console.log(decoded);
        const admin = await Admin.findOne({ name: decoded.name });
        if (!admin) {
            return res.status(411).send({ status: "error", message: "admin not found", code: -2 });
        }
        return res.status(200).send({ status: "ok", message: "admin found", data: admin });
    }
    catch (error) {
        console.log('error in checkAdminLogin is : ', error);
        res.status(500).send({ status: "error", message: "error in checkAdminLogin is : " + error.message, code: -1 });
    }
}
