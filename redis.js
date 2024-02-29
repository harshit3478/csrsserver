const { Socket } = require("dgram");
const { createClient } = require("redis");

const client = createClient({
    // url : process.env.REDIS_URL,
    password : process.env.REDIS_PASSWORD,
    socket : {
        ssl : true,
        host : process.env.REDIS_URL,
        port : 17120,
    }
});

module.exports = { client };
