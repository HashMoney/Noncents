'use strict';

const superagent = require('superagent');
const Chain = require('./model/chain');
const server = require('./lib/server');
const WebSocket = require('./model/socket');

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://heroku_61rbrfdl:auii88ojlv9kju52l3mt6qmuin@ds135777.mlab.com:35777/heroku_61rbrfdl';
// process.env.MONGODB_URI = 'mongodb://localhost/testing';

server.start();

