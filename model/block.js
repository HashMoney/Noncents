'use strict';

class Block {
  constructor(index, previousHash, timeStamp, ledger, currentHash, nonce) {
    this.index = index;
    this.previousHash = previousHash;
    this.timeStamp = timeStamp;
    // this.ledger = ledger;
    this.currentHash = currentHash;
    this.nonce = nonce;
  }
}

module.exports = Block;
