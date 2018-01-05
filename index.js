'use strict';

const superagent = require('superagent');
const Chain = require('./model/chain');
const server = require('./lib/server');
const WebSocket = require('./model/socket');

process.env.PORT = 7000;

server.start();

let mySocket = new WebSocket;
let socketArray = null;
let stableChain = new Chain();
mySocket.address = '172.16.1.148';

mySocket.getSockets()
  .then(sockets => {
    socketArray = sockets;
    for(let socket of socketArray)
      if(socket.address === mySocket.address)
        return;
    mySocket.postSocket();
  });


console.log('beginning mining');
stableChain.mine();
