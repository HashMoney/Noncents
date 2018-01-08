'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Chain = require('../model/chain');
// const apiURL = `http://localhost:${process.env.PORT}`; //Used for local testing
const apiURL = `https://hash-money.herokuapp.com`;

let testChain = new Chain();

let setup = function() {
  return new Promise((resolve, reject) => {
    return resolve();
  })
    .then(() => {
      return testChain.updateChain();
    })
    .then(chain => {
      testChain = chain;
      console.log(testChain);
      if(!testChain.currentChainArray.length){

        return new Promise((resolve, reject) => {
          return resolve();
        })
          .then(() => {
            return testChain.makeGenesisBlock();
          })
          .then(() => {
            console.log('Genesis Block created');
            return;
          })
          .catch(() => {
            console.log('Failed to setup genesis block'); //TODO: Errors: Throw a proper Error here!
            return;
          });
      }
      return testChain;
    })
    .catch(() => {
      console.log('Failed to setup test files'); //TODO: Errors: Throw a proper Error here!
      return;
    });

};

describe('/block Route', () => {
  beforeAll(server.start);
  beforeAll(setup);
  afterAll(server.stop);
  jest.setTimeout(300000);

  describe('POST', ()=> {

    test('Proper Setup should return undefined for makeGenesisBlock', () => {
      expect(testChain.makeGenesisBlock()).toBeUndefined();
    });

    test('Mine should send multiple blocks and return the updated chain', () => {
      let chainToTest = testChain.updateChain();
      return testChain.mine(1)
        .then(chain => {
          expect(chain.currentChainArray.length).toEqual(chainToTest.currentChainArray.length + 1);
          return;
        })
        .catch(() => {
          console.log('failed mining');
          return;
        });
    });

    test('Post should send ONE block to another server and respond with 204', () => {
      let mockBlock;
      return testChain.updateChain()
        .then(() => {
          mockBlock = testChain.makeNextBlock('ledger1');
          return mockBlock;
        })
        .then(newBlock => {
          return superagent.post(`${apiURL}/block`)
            .send(newBlock)
            .then(response => {
              console.log('successfully posted new block');
              expect(response.status).toEqual(200);
              return;
            })
            .catch(() => {
              console.log('failed make next block');
              return;
            });
        });
    });


    test('post should respond with a 400 status if sent a block with an incorrect index', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');
      mockBlock.index = null;

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('post should respond with a 400 status if sent a block with an incorrect previousHash', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');
      mockBlock.previousHash = null;

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('post should respond with a 400 status if sent a block with an incorrect currentHash', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');
      mockBlock.currentHash = null;

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('post should respond with 404 if a block is sent to the wrong route', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');

      return superagent.post(`${apiURL}/`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
//TODO: ADD MORE TESTS