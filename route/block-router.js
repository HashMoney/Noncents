'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Block = require('../model/block');
const Chain = require('../model/chain');

let stableChain;

const blockRouter = module.exports = new Router();

blockRouter.post('/block', jsonParser, (request, response, next) => {
  //TODO: error handling
  return new Promise((resolve, reject) => {
    return resolve();
  })

    .then(() => {
      return Chain.findOne({})
        .then(chain => {
          stableChain = chain;
          // console.log(stableChain);
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
                // console.log(stableChain);
              });
          }
          return stableChain;
        })
        .then(() => {
          let blockToValidate = request.body;
          // console.log(blockToValidate);
          stableChain._addNextBlock(blockToValidate);
          return stableChain.save();
        })
        // .then(chain => console.log(chain))
        .then(() => {
          // console.log('New Block Successfully Added To Chain');
          response.send(stableChain.currentChainArray);
          response.sendStatus(204);
        })
        .catch(next);
        // .catch(() => {
        //   response.sendStatus(400);
        // });
    });
});
