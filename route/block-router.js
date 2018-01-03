'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Block = require('../model/block');
const Chain = require('../model/chain');


let testChain = new Chain();
testChain.currentChainArray.push(new Block (0, 'genesis', 'genesisDate', 'genesisLedger', 'genesisHash'));

const blockRouter = module.exports = new Router();


blockRouter.post('/block', jsonParser, (request, response, next) => {
  //TODO: error handling
  // console.log('request body', request.body);
  let blockToValidate = request.body;
  return testChain._addNextBlock(blockToValidate)
    .save()
    .then(() => {
      console.log('New Block Successfully Added To Chain');
      response.send(testChain.currentChainArray);
      response.sendStatus(204);
    })
    .catch(next);
});


//TODO: check validity
