'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Block = require('../model/block');
const Chain = require('../model/chain');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;
let testChain = null;

let setup = function() {
  return new Promise((resolve, reject) => {
    return resolve();
  })
    .then(() => {
      return Chain.findOne({})
        .then(chain => {
          testChain = chain;
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
              });
          }
          return testChain;
        });
    });
};


describe('/block Routes', () => {
  beforeAll(server.start);
  beforeAll(setup);
  jest.setTimeout(300000);
  afterAll(server.stop);

  describe('POST Route', ()=> {

    test('Proper Setup should return undefined for makeGenesisBlock', () => {
      expect(testChain.makeGenesisBlock()).toBeUndefined();
    });
    
    test('post should respond with a 204 status if sent a correct block by a node', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(response => {
          expect(response.status).toEqual(200);
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

  describe('chainSchema.methods.checkBlockValidity', () => {
    
    test('should return false if given an invalid index', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');
      mockBlock.index = 'falseIndex';
      
      expect(testChain.checkBlockValidity(mockBlock)).toEqual(false);
    });

    test('should return false if given an invalid previousHash', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');
      mockBlock.previousHash = 'falsePreviousHash';
      
      expect(testChain.checkBlockValidity(mockBlock)).toEqual(false);
    });

    test('should return false if given an invalid currentHash', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');
      mockBlock.currentHash = 'falseCurrentHash';
      
      expect(testChain.checkBlockValidity(mockBlock)).toEqual(false);
    });
  });
});
