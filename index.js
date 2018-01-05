'use strict';

const superagent = require('superagent');
const Chain = require('./model/chain');
const server = require('./lib/server');

process.env.PORT = 7000;

server.start();

let stableChain = new Chain();

console.log('beginning mining');
stableChain.mine(1);
