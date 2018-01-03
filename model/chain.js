'use strict';

const mongoose = require('mongoose');
const Block = require('./block');
const Hashes = require('jshashes');
const superagent = require('superagent');
const apiURL = `http://localhost:${process.env.PORT}`;

const chainSchema = mongoose.Schema({
  currentChainArray: [],
});


// Nicholas - this is the main functionality- it builds a new, valid block which can be posted to the other running servers and checked against them.

chainSchema.methods.runBlockFactory = function(ledgerArray){
  if(!ledgerArray.length){
    return console.log('block Factory closed');
  }else {
    console.log(ledgerArray);
    let ledger = ledgerArray.shift();
    console.log(ledger);
    let newBlock = this.makeNextBlock(ledger);
    return superagent.post(`${apiURL}/block`)
      .send(newBlock)
      .then(response => {
        if(response.status === 200){
          console.log(this.currentChainArray);
          this.currentChainArray.push(newBlock);
          console.log(this.currentChainArray);
          return this.runBlockFactory(ledgerArray);
        }
      });
  }
};

chainSchema.methods.makeNextBlock = function(ledger){
  let latestBlock = this.currentChainArray[this.currentChainArray.length - 1];
  // console.log(latestBlock);
  return this._makeNextBlock(latestBlock, ledger);
};

chainSchema.methods._makeNextBlock = function(latestBlock, ledger){
  let nextIndex = latestBlock.index + 1;
  let timeStamp = new Date().toString();
  let newHash = this.makeBlockHash(nextIndex, timeStamp, latestBlock.currentHash, ledger);
  return new Block(nextIndex, latestBlock.currentHash, timeStamp, ledger, newHash);

  //TODO: when we increase the difficulty of the hashing algorithm we will need to find a way to promisify this part of the code.
  // .then(currentHash => {
  //   let result = new Block(nextIndex, latestBlock.currentHash, timeStamp, ledger, currentHash);
  //   console.log(result);
  //   return result;
  // });
};

chainSchema.methods._addNextBlock = function(block) {
  if(this.checkBlockValidity(block)) {
    console.log('adding a new block to chain');
    this.currentChainArray.push(block);
    return this;
  }
};

chainSchema.methods.makeBlockHash = function(index, timeStamp, previousHash, ledger){
  let SHA256 = new Hashes.SHA256;
  let nextHash = SHA256.b64(index + timeStamp + previousHash + ledger);
  return nextHash;
};

chainSchema.methods.calculateHashForBlock = function(block){

  let hashToCheck = this.makeBlockHash(block.index, block.timeStamp, block.previousHash, block.ledger);
  return hashToCheck;
};

chainSchema.methods.checkBlockValidity = function(block){ //TODO: refactor console logs as error throws
  // console.log('block to be checked', block);
  if(!this.currentChainArray[block.index - 1]){
    console.log('invalid index');
    return false;
  }
  if(this.currentChainArray[block.index - 1].currentHash !== block.previousHash){
    console.log('invalid previous currentHash');
    return false;
  }
  if (this.calculateHashForBlock(block) !== block.currentHash){
    console.log('invalid currentHash');
    return false;
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

// chainSchema.methods.removeChainFromDB = function () {
//   this.collection.remove({})
//     .then(() => {
//       console.log('Chain removed from DB');
//     });
// };

module.exports = mongoose.model('chain', chainSchema);
