const express = require('express')
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require('body-parser')
const fs = require('fs');
const cors = require('cors')
const Grid = require("gridfs-stream");
const path = require('path');
const cookieParser = require('cookie-parser');
const { connect } = require('http2');
const upload = require('./middleware/upload.js');
const connection = require('./mongoose/connection.js');
const { User } = require('./mongoose/User.js');
const {client}  = require('./redis.js');
const {Server} = require('socket.io');

app.use(cookieParser());

const io = new Server(server ,
  {
    cors: {
      origin: "https://csrsweb.vercel.app",
      methods: ["GET", "POST"]
    }
  });
// console.log('io')
module.exports = io;
io.on('connection', (socket) => {
  console.log(socket.id)
  console.log('a user connected');
  socket.on('emergency-resolved', (data) => {
    socket.emit('emergency-created-response-2' , data)
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
connection();
// const conn = mongoose.connection;
app.use(bodyParser.urlencoded(
  { extended: true }
))
// SET STORAGE
try {
  
  client.connect();
  client.on("error", err => console.log("Redis client error: ", err));
  client.on("connect", () => console.log("Connected to redis"));
  
 
} catch (e) {
  console.log(e)
}
app.post("/upload", upload.single('avatar'), (req, res) => {
  console.log(req.file)
  res.send('file uploaded')
})
//CORS POLICY
app.use(cors(
  // l{origin: ['https://csrsweb.vercel.app/', '*']}
))
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
//body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', require('./controller/router.js'))
app.get('/', (req, res) => {
  res.send('<h1> Server is running ..... </h1>')
})

server.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`)
})

