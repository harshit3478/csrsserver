const {Admin } = require('../mongoose/admin');

exports.adminLogin = async (req, res) => {
    try {
        const { name , password } = req.body;
        const admin = await Admin.findOne({name:name});
        if (!admin) {
            return res.status(411).send({ status: "error", message: "admin not found", code: -2 });
        }
        if (admin.password !== password) {
            return res.status(411).send({ status: "error", message: "password is incorrect", code: -2 });
        }
        return res.status(200).send({ status: "ok", message: "admin logged in", code: 1 });
    }
    catch (error) {
        console.log('error in adminLogin is : ', error);
        res.status(500).send({ status: "error", message: "error in adminLogin is : " + error.message, code: -1 });
    }
}
