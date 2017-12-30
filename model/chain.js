'use strict';

const HASH_SALT_ROUNDS = 5;

const mongoose = require('mongoose');
const Block = require('./block');
const bcrypt = require('bcrypt');

const chainSchema = mongoose.Schema({
  root: { type: Object, required: true },
});

chainSchema.methods.makeNextBlock = (ledger) => {
  let latestBlock = this.root[this.root.length - 1];

  return this._makeNextBlock(latestBlock, ledger);
};

chainSchema.methods._makeNextBlock = (latestBlock, ledger) => {
  let nextIndex = latestBlock.index + 1;
  let timestamp = new Date();
  let currentHash = this.makeBlockHash(nextIndex, timestamp, latestBlock.currentHash, ledger); //TODO: create this method
  
  return new Block(index, previousHash, timestamp, ledger, currentHash);
};

chainSchema.methods.makeBlockHash = (nextIndex, timestamp, currentHash, ledger) => {
  return bcrypt.hash((nextIndex + timestamp + currentHash + ledger).toString(), HASH_SALT_ROUNDS)
    .then(newHash => {
      console.log(newHash);
      return newHash;
    });
};

module.exports = mongoose.model('chain', chainSchema);