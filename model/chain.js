'use strict';

const mongoose = require('mongoose');
const Block = require('./block');
// const httpErrors = require('http-errors');
const Hashes = require('jshashes');
const superagent = require('superagent');
const logger = require('../lib/logger');
// const apiURL = http://localhost:${process.env.PORT}`;
const apiURL = `https://hash-money.herokuapp.com`;
const faker = require('faker');

const leadingZeros = '000';
const hashSlice = 3;

const chainSchema = mongoose.Schema({
  currentChainArray: [],
});

chainSchema.methods.makeGenesisBlock = function() {
  if(this.currentChainArray.length > 0) {
    console.log('Genesis Block already exists'); //TODO: Errors: Throw a proper Error here!
    return;
  }
  let index = 0;
  let previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
  let timeStamp = 'genesisDate';
  let ledger = 'genesisLedger';
  let nonce = 0;

  let currentHash = this.makeBlockHash(index, timeStamp, previousHash, ledger, nonce);

  while (currentHash.slice(0, hashSlice) !== leadingZeros) { // This is where we increase the difficulty of the hash by increasing the leading Zero's, '000'.
    nonce++; // The Nonce essentially is the number of times the hash had to be re-hashed to match the leading Zero's requirement.
    currentHash = this.makeBlockHash(index, timeStamp, previousHash, ledger, nonce); // Make another hash until it meets the leading Zero requirement.
  }

  let genesis = new Block(index, previousHash, timeStamp, ledger, currentHash, nonce);
  this.currentChainArray.push(genesis);
  this.save();
  return this;

};

chainSchema.methods.makeNextBlock = function(ledger){
  let latestBlock = this.currentChainArray[this.currentChainArray.length - 1];
  return this._makeNextBlock(latestBlock, ledger);
};

chainSchema.methods._makeNextBlock = function(latestBlock, ledger){
  let nextIndex = latestBlock.index + 1;
  let timeStamp = new Date().toString();
  let nonce = 0;

  let newHash = this.makeBlockHash(nextIndex, timeStamp, latestBlock.currentHash, ledger, nonce);

  while (newHash.slice(0, hashSlice) !== leadingZeros) {
    nonce++;
    newHash = this.makeBlockHash(nextIndex, timeStamp, latestBlock.currentHash, ledger, nonce);
  }

  return new Block(nextIndex, latestBlock.currentHash, timeStamp, ledger, newHash, nonce);
};

chainSchema.methods.makeBlockHash = function(index, timeStamp, previousHash, ledger, nonce){
  let SHA256 = new Hashes.SHA256;
  let nextHash = SHA256.b64(index + timeStamp + previousHash + ledger);
  let nonceHash = SHA256.b64(nextHash + nonce);
  return nonceHash;
};

chainSchema.methods.updateChain = function(){
  return superagent.get(`${apiURL}/chain`)
    .then(response => {
      if(response.body[0])
        this.currentChainArray = response.body[0].currentChainArray;
      return this;
      //TODO: Add Error catching here?
    });
};

chainSchema.methods.mine = function(count=9999){ // 9999 limits the times mined to for testing purposes
  if(count === 0){
    console.log('Finished mining for now');
    return this.updateChain()
      .then(chain => {
        return chain;
      });
  }
  count--;
  return this.updateChain()
    .then(() => {
      return this.makeNextBlock(faker.lorem.words(10));
    })
    .then(block => {
      console.log('Block to post :', block);
      logger.log('Block to post :', block);
      return superagent.post(`${apiURL}/block`)
        .send(block)
        .then(response =>{
          console.log('----------------------------------------\nYour Block posted successfully!\n----------------------------------------');
          logger.log('Block posted successfully');
          console.log(response.status);
          return;
        })
        .then(() => {
          return this.mine(count);
        })
        .catch(() => {
          console.log('----------------------------------------\nSomeone else mined this block before you\nOR\nYour Block is Invalid!\n----------------------------------------'); //TODO: Errors: Throw a proper Error here!
          return this.mine(count);
        });
    });
};

module.exports = mongoose.model('chain', chainSchema);
