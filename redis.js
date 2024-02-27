const { Socket } = require("dgram");
const { createClient } = require("redis");

const client = createClient({
    url : process.env.REDIS_URL,
    sockets : {
        ssl : true,
    }
});

module.exports = { client };
