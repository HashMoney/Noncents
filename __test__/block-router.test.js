'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Block = require('../model/block');
const Chain = require('../model/chain');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/block routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  let testChain = new Chain();
  testChain.currentChainArray.push(new Block (0, 'genesis', 'genesisDate', 'genesisLedger', 'genesisHash'));

  // let testChain = Chain.collection.find({});


  describe('post', ()=> {
    test('runBlockFactory should continuously build blocks and the testChain length should be the genesis block + the number of elements in the mock ledger Array', () => {
      let mockFactoryLedgerArray = ['flone', 'fltwo', 'flthree', 'flfour', 'flfive'];
      return testChain.runBlockFactory(mockFactoryLedgerArray)
        .then(() => {
          expect(testChain.currentChainArray.length).toEqual(6);
        });
    });

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
  });
});
