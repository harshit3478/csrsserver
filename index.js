const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connect } = require('http2');
const upload = require('./middleware/upload.js');
const connection = require('./mongoose/connection.js');
const { User } = require('./mongoose/User.js');
const { client } = require('./redis.js');
const { Server } = require('socket.io');

app.use(cookieParser());

// CORS for Express
app.use(cors());

// Body parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connecting to Redis
try {
  client.connect();
  client.on("error", err => console.log("Redis client error: ", err));
  client.on("connect", () => console.log("Connected to redis"));
} catch (e) {
  console.log(e)
}

// Configuring Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
module.exports = io;

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

// Connecting to MongoDB
connection();

// Routes
app.use('/', require('./controller/router.js'));

app.get('/', (req, res) => {
  res.send('<h1> Server is running ..... </h1>');
});

// Starting the server
server.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
