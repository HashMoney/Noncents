'use strict';

const server = require('./lib/server');

//These variables are saved for local testing in the future - Seth
// process.env.MONGODB_URI = 'mongodb://heroku_61rbrfdl:auii88ojlv9kju52l3mt6qmuin@ds135777.mlab.com:35777/heroku_61rbrfdl';
// process.env.PORT = 7000;
// process.env.MONGODB_URI = 'mongodb://localhost/testing';

server.start();
