'use strict';

const faker = require('faker');
const Block = require('../../model/block');
const Chain = require('../../model/chain');

const BlockMockFactory = module.exports = {};

let testChain = null;

BlockMockFactory.setup = function() {
  return new Promise((resolve, reject) => {
    return resolve();
  })
    .then(() => {
      return Chain.findOne({})
        .then(chain => {
          testChain = chain;
          // console.log(testChain);
          if(!testChain){

            testChain = new Chain();

            return new Promise((resolve, reject) => {
              return resolve();
            })
              .then(() => {
                return testChain.makeGenesisBlock();
              })
              .then(() => {
                console.log('Genesis Block Created');
                // console.log(testChain);
              });
          }
          return testChain;
        });
    });
};

BlockMockFactory.create = () => {
  const mock = {};
  // let mockBlock = null;
  // let mockChain = null;
  mock.request = {
    index: faker.random.number(),
    previousHash: faker.random.alphaNumeric(42),
    timeStamp: new Date(),
    ledger: faker.lorem.paragraphs(3),
    currentHash: faker.random.alphaNumeric(42),
    nonce: faker.random.number(4),
  };

  return (mock.request.index, mock.request.previousHash, mock.request.timeStamp, mock.request.ledger, mock.request.currentHash, mock.request.nonce)
    .then(block => {
      mock.block = block;
      return block.currentHash;
    })
    .then(currentHash => {
      mock.currentHash = currentHash;
      return Block.findById(mock.block.currentHash);
    })
    .then(block => {
      mock.block = block;
      return mock;
    });
};

   


// blockMockFactory.remove = () => Block.remove({})