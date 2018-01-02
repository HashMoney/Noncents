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
  let timeStamp = new Date();

  this.makeBlockHash(nextIndex, timeStamp, latestBlock.currentHash, ledger)
    .then(currentHash => {
      let result = new Block(nextIndex, latestBlock.currentHash, timeStamp, ledger, currentHash);
      console.log(result);
      return result;
    });

  // return new Block(nextIndex, latestBlock.currentHash, timeStamp, ledger, currentHash);

};

chainSchema.methods._addNextBlock = function(block) {
  if(this.checkBlockValidity(block))
    this.currentChainArray.push(block);
};

chainSchema.methods.makeBlockHash = function(nextIndex, timeStamp, previousHash, ledger){
  return bcrypt.hash((nextIndex + timeStamp + previousHash + ledger).toString(), HASH_SALT_ROUNDS)
    .then(newHash => {
      return newHash;
    });
};

chainSchema.methods.calculateHashForBlock = function(block){
  return this.makeBlockHash(block.index, block.timeStamp, block.previousHash, block.ledger);
};

chainSchema.methods.checkBlockValidity = function(block){ //TODO: refactor console logs as error throws
  if(!this.currentChainArray[block.index - 1]){
    console.log('invalid index');
    return null;
  }
  if(this.currentChainArray[block.index - 1].currentHash !== block.previousHash){
    // console.log(this.currentChainArray[block.index - 1].currentHash, block.previousHash);
    console.log('invalid previous currentHash');
    return null;
  }


  console.log(block);
  console.log(block.index);
  console.log(block.timeStamp);
  console.log(block.previousHash);
  console.log(block.ledger);
  console.log(block.currentHash);

  let blockRaw = (block.index + block.timeStamp + block.previousHash + block.ledger).toString();
  console.log(blockRaw);
  console.log((1 + '2017-12-31T22:39:27.677Z' + 'one' +'ledger').toString());

  // bcrypt.compare(((block.nextIndex+ block.timeStamp+ block.currentHash+ block.ledger), block.currentHash));
  return bcrypt.compare(blockRaw, block.currentHash)
    .then(bool => console.log('comparing test', bool))
    .catch(bool => console.log('badbool', bool));



  // return this.calculateHashForBlock(block)
  //   .then(hash => {
  //     if(hash !== block.currentHash){
  //       console.log('invalid currentHash');
  //       console.log(hash, block.currentHash);
  //       return null;
  //     }
  //     console.log('Block is valid');
  //     return true; //TODO: if true, push block to end of chain
  //   });

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
