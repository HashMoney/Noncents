'use strict';

const HASH_SALT_ROUNDS = 0;

const mongoose = require('mongoose');
const Block = require('./block');
const bcrypt = require('bcrypt');

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

chainSchema.methods.makeBlockHash = function(nextIndex, timestamp, currentHash, ledger){
  return bcrypt.hash((nextIndex + timestamp + currentHash + ledger).toString(), HASH_SALT_ROUNDS)
    .then(newHash => {
      return newHash;
    });
};

chainSchema.methods.calculateHashForBlock = function(block){
  return this._makeBlockHash(block.nextIndex, block.timestamp, block.currentHash, block.ledger);
};

chainSchema.methods.checkBlockValidity = function(block){ //TODO: refactor console logs as error throws
  console.log(block);
  if(!this.currentChainArray[block.index - 1]){
    console.log('invalid index');
    return null;
  }
  if(this.currentChainArray[block.index - 1].hash !== block.previousHash){
    console.log('invalid previous hash');
    return null;
  }
  if(this.calculateHashForBlock(block) !== block.hash){
    console.log('invalid hash');
    return null;
  }
  console.log('Block is valid');
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