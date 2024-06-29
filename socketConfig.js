// socketConfig.js
const { Server } = require('socket.io');
const httpServer = require('http').createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(socket.id);
  console.log('a user connected');
  
  socket.on('emergency-resolved', (data) => {
    socket.emit('emergency-created-response-2', data);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports = io;