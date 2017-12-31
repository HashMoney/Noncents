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
// testChain.currentChainArray.push(testChain.makeNextBlock('sethIsBadAtPingPong, worse than nick'));
// console.log(testChain.currentChainArray);


const blockRouter = module.exports = new Router();
// $2a$10$yYObEAjMSPpFIO/6L9mQnuUVmL8XG9cICQvc5o2TwZckgdJu9gF62
// $2a$10$HcgGgE1UsO3pBLoAQNq2yu.9M6QiGhsXTMJTmRM3AZJXRhmKzRQTO

testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
testChain.makeBlockHash(1, 1234, 'one', 'ledger')
  .then(hash => console.log(hash));
                

blockRouter.post('/block', jsonParser, (request, response, next) => {
  //TODO: error handling
  console.log(request.body);
  let blockToValidate = request.body;
  return testChain.checkBlockValidity(blockToValidate)
    .then(boolian => {
      if(boolian){//TODO: refactor this to the chain in db
        console.log('did i break');
        throw new httpErrors(400, 'block is not a valid block for the current chain');
      }
      testChain.currentChainArray.push(blockToValidate)
        .save()
        .then(() => {
          console.log('New Block Successfully Added To Chain');
          response.sendStatus(204);
        })
        .catch(next);
    });

});


//TODO: check validity
