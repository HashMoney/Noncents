'use strict';

const HASH_SALT_ROUNDS = 0;

const mongoose = require('mongoose');
const Block = require('./block');
const Hashes = require('jshashes');


const chainSchema = mongoose.Schema({
  currentChainArray: [],
});

chainSchema.methods.makeNextBlock = function(ledger){
  let latestBlock = this.currentChainArray[this.currentChainArray.length - 1];
  return this._makeNextBlock(latestBlock, ledger);
};

chainSchema.methods._makeNextBlock = function(latestBlock, ledger){
  let nextIndex = latestBlock.index + 1;
  let timestamp = new Date();

  this.makeBlockHash(nextIndex, timestamp, latestBlock.currentHash, ledger)
    .then(currentHash => {
      let result = new Block(nextIndex, latestBlock.currentHash, timestamp, ledger, currentHash);
      console.log(result);
      return result;
    });

  // return new Block(nextIndex, latestBlock.currentHash, timestamp, ledger, currentHash);

};

chainSchema.methods._addNextBlock = function(block) {
  if(this.checkBlockValidity(block))
    this.currentChainArray.push(block);
};

chainSchema.methods.makeBlockHash = function(index, timestamp, previousHash, ledger){
  let SHA256 = new Hashes.SHA256;
  let testHash = SHA256.b64(index + timestamp + previousHash + ledger);
  console.log('SHA256 hash', testHash);
  return testHash;
};

chainSchema.methods.calculateHashForBlock = function(block){
  console.log('block passed to calculateH4B method', block);
  return this.makeBlockHash(block.index, block.timestamp, block.previousHash, block.ledger);
};

chainSchema.methods.checkBlockValidity = function(block){ //TODO: refactor console logs as error throws
  // console.log(block);
  if(!this.currentChainArray[block.index - 1]){
    console.log('invalid index');
    return null;
  }
  if(this.currentChainArray[block.index - 1].currentHash !== block.previousHash){
    // console.log(this.currentChainArray[block.index - 1].currentHash, block.previousHash);
    console.log('invalid previous currentHash');
    return null;
  }
  if (this.calculateHashForBlock(block) !== block.currentHash){
    console.log('invalid currentHash');
    return null;
  }
  console.log('Block is valid');
  console.log('should be a matching hash', this.calculateHashForBlock(block));
  return true; //TODO: if true, push block to end of chain
};


chainSchema.methods.checkChainValidity = function (updatedChain, stableChain) {
  if (stableChain.currentChainArray[0] !== updatedChain.currentChainArray[0]) {
    return false;
  }

  for (let block in updatedChain.currentChainArray) {
    if (!this.checkBlockValidity(block)) return false;
  }
  return true;
};

module.exports = mongoose.model('chain', chainSchema);
