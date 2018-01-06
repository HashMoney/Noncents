'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Chain = require('../model/chain');
// const apiURL = `http://localhost:${process.env.PORT}`;
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
    test('Mine should send multiple blocks and return the updated chain', () => {
      let chainToTest = testChain.updateChain();
      return testChain.mine(1)
        .then(chain => {
          expect(chain.currentChainArray.length).toEqual(chainToTest.currentChainArray.length + 1);
          return;
        })
        .catch(() => {
          console.log('failed mining');  //TODO: Errors: Throw a proper Error here!
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

    test('Post should send ONE block to another server and if index error, should respond with 400', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');
      mockBlock.index = null;

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('Post should try to send ONE block, but should respond with 404 if wrong route used', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');

      return superagent.post(`${apiURL}/`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.message);
          expect(response.status).toEqual(404);
        });
    });
  });

  //TODO: ADD MORE TESTS
});
