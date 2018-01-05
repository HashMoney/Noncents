'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Block = require('../model/block');
const Chain = require('../model/chain');
const faker = require('faker');

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

};

describe('/block routes', () => {
  beforeAll(server.start);
  beforeAll(setup);
  afterAll(server.stop);

  describe('post', ()=> {
    // test('runBlockFactory should continuously build blocks and the testChain length should be the genesis block + the number of elements in the mock ledger Array', () => {
    //   let length = testChain.currentChainArray.length;
    //   let mockFactoryLedgerArray = ['flone', 'fltwo', 'flthree', 'flfour', 'flfive'];
    //   return testChain.runBlockFactory(mockFactoryLedgerArray)
    //     .then(() => {
    //       expect(testChain.currentChainArray.length).toEqual(length + 5);
    //     });
    // });

    test('post should send ONE block to another server and respond with 204', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });


    //TODO: ADD EDGE CASE TESTS

    //TODO: ADD ERROR CHECKING TESTS
    test('post should send ONE block to another server and if index error, should respond with 400', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');
      // console.log('first index', mockBlock.index);
      mockBlock.index = null;
      // console.log('second index', mockBlock.index);
      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('post should try to send ONE block, but should respond with 404 if wrong route used', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');

      return superagent.post(`${apiURL}/`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          console.log(response.message);
          expect(response.status).toEqual(404);
        });
    });

    // test('post should try to send ONE block, but should respond with 404 if wrong route used', () => {
    //   let blockObj;
    //   let blockObj2;
    //   return new Promise ((resolve,reject) => {
    //     return resolve();
    //   })
    //     .then(() => {
    //       let blockObj = testChain.makeNextBlock('duplicate ledger');
    //       console.log(blockObj);
    //       return blockObj;
    //     })
    //     .then(blockObj => {
    //       console.log(blockObj);
    //       return superagent.post(`${apiURL}/block`)
    //         .send({blockObj});
    //     })
    //     .then((block) => {
    //       blockObj2 = block;
    //       console.log(blockObj2);
    //       return superagent.post(`${apiURL}/block`)
    //         .send({ blockObj2});
    //     })
    //     .then(Promise.reject)
    //     .catch(response => {
    //       console.log(response.message);
    //       expect(response.status).toEqual(409);
    //     });
    // });
  });
});
