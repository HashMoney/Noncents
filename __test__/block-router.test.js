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
  let block2 = testChain.makeNextBlock('ledger2');
  let block3 = testChain.makeNextBlock('ledger3');
  let block4 = testChain.makeNextBlock('ledger4');
  let block5 = testChain.makeNextBlock('ledger5');
  let block6 = testChain.makeNextBlock('ledger6');


  // let mockBlock = new Block(1, 'one', '2017-12-31T22:39:27.677Z', 'ledger', 'rExHtz+3PHbMpWkPsKp+EbmUGZUlXcP/LMfQ4G5gCDc=');

  describe('post', ()=> {
    test('post should send a block to another server and respond with 204', () => {
      return superagent.post(`${apiURL}/block`)
        .send(block1)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
    test.only('runBlockFactory should continuously build blocks until', () => {
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
