const { Admin } = require("../../../models/admin.schema");
const jwt = require("jsonwebtoken");

const login = async ({body}) => {
    try{
        
        const { name, password } = body;
        const users = await  Admin.find();
        console.log(users);

        const admin = await Admin.findOne({ name: name });
        if (!admin) return { status: "400", message: "admin not found"};
        if (admin.password !== password) return { status: 401, message: "password is incorrect"};
        return { status: 200 , data : {
            id: admin._id,
            name: admin.name,
            token: jwt.sign(
                { id: admin._id, name: admin.name },
                process.env.JWT_SECRET,
                {
                    expiresIn: '30d',
                }
            )
        }};
               
    } catch(error){
        console.log('error in adminLogin is : ', error);
        return { status: 500, message: "error in adminLogin is : " + error.message};
    }
}

const getCurrentUser = async({params}) => {
    try {
        console.log(params.token);
        const token = params.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ name: decoded.name });
        if (!admin) return { status: 400, message: "admin not found"};
        return { status: 200, data: admin };
    } catch(error){
        console.log('error in checkAdminLogin is : ', error);
        return { status: 500, message: "error in checkAdminLogin is : " + error.message};
    }
}

module.exports = {
    login,
    getCurrentUser
}
