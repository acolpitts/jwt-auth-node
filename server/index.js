// Main application entry point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors')
const config = require('./config');
const env = process.env.NODE_ENV || 'dev';

let DATABASE = config.MONGO_DB;

if (env === 'PRODUCTION') {
  DATABSE = process.env.MONGO;
}

// DB SETUP
mongoose.connect(DATABASE);

// APP SETUP
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// SERVER SETUP
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Magic happens on port ' + port );