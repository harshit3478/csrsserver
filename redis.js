// const { Socket } = require("dgram");
const { createClient } = require("redis");
require("dotenv").config();

const client = createClient({
    username : 'default',
    password : process.env.REDIS_PASSWORD,
    socket : {
        ssl : true,
        host : process.env.REDIS_URL,
        port : process.env.REDIS_PORT,
    }
});
// const client = createClient({
//   host: "127.0.0.1",
//   port: 6379,
// });


module.exports = { client };
