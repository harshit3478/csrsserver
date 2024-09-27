// socketConfig.js
const { Server } = require('socket.io');
const sendNotification = require('./src/middlewares/helpers/notification');
const httpServer = require('http').createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io.listen(4000)
console.log("io is initialized " ,  io._checkNamespace)

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(socket.id);
  console.log('a user connected');
  socket.on('emergency-resolved', (data) => {
    socket.emit('emergency-created-response-2', data);
  });
  socket.on('respond-to-alert' , (data) =>{
    console.log("respond-to-alert" , data)
    sendNotification(data  , "Help is on the way", "Try to be calm and wait for the help to arrive")
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = io;