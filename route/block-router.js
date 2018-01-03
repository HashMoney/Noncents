'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Block = require('../model/block');
const Chain = require('../model/chain');

let stableChain = Chain.collection.find({});
console.log(stableChain);

if(!stableChain){

  stableChain = new Chain();
  stableChain.currentChainArray.push(new Block (0, 'genesis', 'genesisDate', 'genesisLedger', 'genesisHash'));
  console.log('Genesis Block Created');
}

const blockRouter = module.exports = new Router();


blockRouter.post('/block', jsonParser, (request, response, next) => {
  //TODO: error handling
  let blockToValidate = request.body;
  return stableChain._addNextBlock(blockToValidate)
    .save()
    .then(() => {
      console.log('New Block Successfully Added To Chain');
      response.send(stableChain.currentChainArray);
      response.sendStatus(204);
    })
    .catch(next);
});