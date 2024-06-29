const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const fs = require("fs");
const path = require("path");
const { client } = require('./redis');


// Load environment variables
require("dotenv").config();

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Setting Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8001}`,
      },
    ],
  },
  apis: [
    "./src/api/auth/v1/auth.router.js",
    "./src/api/contacts/v1/contacts.router.js",
    "./src/api/emergency/v1/emergency.router.js",
    "./src/api/admin/v1/admin.router.js",
  ],
};

// Validate Swagger spec files before generating specs
function validateSpecFiles(filePaths) {
  filePaths.forEach((pattern) => {
    const files = path.resolve(__dirname, pattern);
    if (!fs.existsSync(files)) {
      console.error(`Swagger spec file not found: ${files}`);
      throw new Error(`Swagger spec file not found: ${files}`);
    }
    const content = fs.readFileSync(files, 'utf8');
    if (!content) {
      console.error(`Swagger spec file is empty or invalid: ${files}`);
      throw new Error(`Swagger spec file is empty or invalid: ${files}`);
    }
  });
}

try {
  validateSpecFiles(options.apis);
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
} catch (error) {
  console.error("Error setting up Swagger:", error.message);
}

// Using Routes
app.use("/", require("./src/api/api.router"));

// Default route
app.get('/', (req, res) => {
  res.send('<h1> Server is running ..... </h1>');
});

app.post('/heartbeat', (req, res) => {
  console.log('Received heartbeat from client.');
  res.sendStatus(200); // Respond with a success status code
});

// Error handling route
app.use((req, res, next) => {
  res.status(500).json({
    message: "Something went wrong",
  });
});



// Server and MongoDB setup
const port = process.env.PORT || 8001;

mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function callback() {
  console.log("MongoDB connected!!!");
  httpServer.listen(port, () => {
    console.log("Server is running on port", port);
  });
});

try {
  client.connect();
  client.on("error", err => console.log("Redis client error: ", err));
  client.on("connect", () => console.log("Connected to redis"));
} catch (e) {
  console.log(e)
}