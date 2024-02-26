const mongoose = require("mongoose");
require("dotenv").config();

module.exports = async function connection() {
    try {
        
        await mongoose.connect(process.env.Mongo_Url);
        console.log("connected to database");
    } catch (error) {
        console.log(error);
        console.log("could not connect to database");
    }
};