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

describe('/block routes', () => {
  beforeAll(server.start);
  beforeAll(setup);
  afterAll(server.stop);

  describe('post', ()=> {
    test('post should send ONE block to another server and respond with 204', () => {
      let mockBlock = testChain.makeNextBlock('ledger1');

      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });

    test('post should send ONE block to another server and if index error, should respond with 400', () => {
      let mockBlock = testChain.makeNextBlock('ledger2');
      mockBlock.index = null;
      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('post should send ONE block to another server and if previousHash is incorrect then it should respond with 400', () => {
      let mockBlock = testChain.makeNextBlock('ledger3');
      mockBlock.previousHash = null;
      console.log(mockBlock.previousHash);
      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('post should send ONE block to another server and if currentHash is incorrect then it should respond with 400', () => {
      let mockBlock = testChain.makeNextBlock('ledger3');
      mockBlock.currentHash = null;
      console.log(mockBlock.currentHash);
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
