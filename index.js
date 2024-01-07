const express = require('express')
const app = express();
const http = require("http");
const server = http.createServer(app);
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//CORS POLICY
app.use(cors())
//body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/' , require('./auth/router.js'))
mongoose.connect('mongodb://127.0.0.1:27017/datsol?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.3')
.then(()=>{
    console.log('connected to database succesfully')
})
server.listen(5000 , ()=>{
    console.log('server is listening on port 5000')
})