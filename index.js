'use strict';
// This index is used for the Node server to Mine!

//TODO: Properly change this index to a Mine.js file and use in a CLI or GUI.
// const superagent = require('superagent'); //TODO: Future Stretch goals
const Chain = require('./model/chain');
const server = require('./lib/server');

process.env.PORT = 7000;

server.start();

let stableChain = new Chain();

console.log(`----------------------------------------\nThis Node is now Mining for the next block \n   'Ctrl+c' to stop mining\n----------------------------------------`);
stableChain.mine();