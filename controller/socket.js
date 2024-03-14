const io  = require('../index.js');
exports.socket = (req , res ) => {
    console.log(io);
    if (io) {
        console.log('emmited')
        // io.emit('emergency-created', "emergency");
        io.on('connection', (socket) => {
            console.log(socket.id)
            console.log('a user connected');
            socket.on('chat', (msg) => {
                console.log('message: ' + msg);
            });
        });
    }
    res.status(200).send({ status: 'success', message: 'socket emitted' + io, code: 1});
}