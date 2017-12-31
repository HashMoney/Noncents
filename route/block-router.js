'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Block = require('../model/block');
const Chain = require('../model/chain');


let testChain = new Chain();
let date = new Date();
let hash = testChain.makeBlockHash(0, date, 'genesis', 'ledger');
testChain.currentChainArray.push(new Block (0, 'genesis', date, 'ledger', 'one'));
console.log(testChain.currentChainArray);
// testChain.currentChainArray.push(testChain.makeNextBlock('sethIsBadAtPingPong, worse than nick'));
// console.log(testChain.currentChainArray);


const blockRouter = module.exports = new Router();

blockRouter.post('/block', jsonParser, (request, response, next) => {
  console.log('request', request.body);
  console.log(testChain.currentChainArray);
  //TODO: error handling
  let blockToValidate = request.body;
  testChain.checkBlockValidity(blockToValidate);

  return new WebSocket({
    address: request.body.address,
  }).save()
    .then(() => response.sendStatus(204))
    .catch(next);
});


//TODO: check validity
