'use strict';

let Chain = require('./model/chain');

let testChain = new Chain();

testChain.makeBlockHash(1, 2, 3, 4);