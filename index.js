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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:54362');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//body parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/' , require('./auth/router.js'))
app.get('/' , (req,res)=>{
    res.send('<h1> Server is running ..... </h1>')
})
mongoose.connect(process.env.Mongo_Url)
.then(()=>{
    console.log('connected to database succesfully')
})
server.listen(process.env.PORT , ()=>{
    console.log('server is listening on port 5000')
})