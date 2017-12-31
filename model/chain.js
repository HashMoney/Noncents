'use strict';

const HASH_SALT_ROUNDS = 5;

const mongoose = require('mongoose');
const Block = require('./block');
const bcrypt = require('bcrypt');

const chainSchema = mongoose.Schema({
  currentChainArray: [],
});

chainSchema.methods.makeNextBlock = function(ledger){
  let latestBlock = this.currentChainArray[this.currentChainArray.length - 1];
  console.log(latestBlock);
  return this._makeNextBlock(latestBlock, ledger);
};

chainSchema.methods._makeNextBlock = function(latestBlock, ledger){
  let nextIndex = latestBlock.index + 1;
  let timestamp = new Date();
  let currentHash = this.makeBlockHash(nextIndex, timestamp, latestBlock.currentHash, ledger);


  if(typeof currentHash === 'string'){
    console.log('current hash is ----------', currentHash);
    return new Block(nextIndex, latestBlock.currentHash, timestamp, ledger, currentHash);

  }
};

chainSchema.methods.makeBlockHash = function(nextIndex, timestamp, currentHash, ledger){
  return bcrypt.hash((nextIndex + timestamp + currentHash + ledger).toString(), HASH_SALT_ROUNDS)
    .then(newHash => {
      console.log('-----------newhash', newHash);
      return newHash;
    });
};

chainSchema.methods.calculateHashForBlock = function(block){
  return this._makeBlockHash(block.nextIndex, block.timestamp, block.currentHash, block.ledger);
};

chainSchema.methods.checkBlockValidity = function(block){ //TODO: refactor console logs as error throws
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
  return true;
};

module.exports = mongoose.model('chain', chainSchema);
