'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Chain = require('../model/chain');

let stableChain;

const blockRouter = module.exports = new Router();

blockRouter.post('/block', jsonParser, (request, response, next) => {
  return new Promise((resolve, reject) => {
    return resolve();
  })

    .then(() => {
      return Chain.findOne({})
        .then(chain => {
          stableChain = chain;
          if(!stableChain){

            stableChain = new Chain();
            return new Promise((resolve, reject) => {
              return resolve();
            })
              .then(() => {
                return stableChain.makeGenesisBlock();
              })
              .then(() => {
                console.log('Genesis Block Created');
              });
          }
          return stableChain;
        })
        .then(() => {
          //TODO: ADD ROUTE PROTECTION HERE SO NO PROPERTIES CAN BE ADDED TO THE BLOCK. - Seth
          // The block can currently be sent with extra properties as there is no check to make sure there are only the proper properties sent with the block.
          // This would need a check of the request.body to have certain properties and ONLY those properties.

          let blockToValidate = request.body;

          if (blockToValidate.hasOwnProperty('nonce') && blockToValidate.hasOwnProperty('currentHash') && blockToValidate.hasOwnProperty('ledger') && blockToValidate.hasOwnProperty('timeStamp') && blockToValidate.hasOwnProperty('previousHash') && blockToValidate.hasOwnProperty('index') && Object.keys(blockToValidate).length === 6) {
            
            console.log('hit prop check');
            console.log(Object.keys(blockToValidate).length);
            stableChain._addNextBlock(blockToValidate);

            return stableChain.save();
          } else {
            console.log('hit prop else to throw error');
            throw new httpErrors(400, 'invalid information in block');
          } 
        })
        .then(() => {
          response.send(stableChain.currentChainArray);
          response.sendStatus(204);
        })
        .catch(next); //TODO: Errors: Throw a proper Error here! - Seth
    });
});
