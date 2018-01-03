
'use strict';

class Block {
  constructor(index, previousHash, timeStamp, ledger, currentHash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timeStamp = timeStamp;
    this.ledger = ledger;
    this.currentHash = currentHash;
  }
}

module.exports = Block;
