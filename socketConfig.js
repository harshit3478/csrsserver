// socketConfig.js
const { httpServer } = require('./app');  // Import the server
const socketIo = require('socket.io');
const sendNotification = require('./src/middlewares/helpers/notification');

// Initialize Socket.IO with the HTTP server
const io = socketIo(httpServer,{
  cors: {
    origin: "*" ,
    methods: ["GET", "POST"],
  },
});
console.log("io is initialized");
io.on('connection', (socket) => {
  console.log(socket.id);
  console.log('a user connected');
  socket.on('emergency-resolved', (data) => {
    socket.emit('emergency-created-response-2', data);
  });

  socket.on('respond-to-alert', (data) => {
    console.log('respond-to-alert', data);
    sendNotification(data, "Help is on the way", "Try to be calm and wait for the help to arrive");
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = io;