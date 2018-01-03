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
  let block1 = testChain.makeNextBlock('ledger1');

  describe('post', ()=> {
    test('post should send a block to another server and respond with 204', () => {
      return superagent.post(`${apiURL}/block`)
        .send(block1)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
    test('runBlockFactory should continuously build blocks until', () => {
      let mockFactoryLedgerArray = ['flone', 'fltwo', 'flthree', 'flfour', 'flfive'];
      return testChain.runBlockFactory(mockFactoryLedgerArray)
        .then(() => {
          expect(testChain.currentChainArray.length).toEqual(6);
        });
    });


    //makes a new 'valid' block //callback function that
    //sends to server a
    //server a sends a 204
    //then i append it to my own chain if you get a 204
    //then i begin to build another block //calls the callback
  });
});
