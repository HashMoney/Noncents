
'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');


class Block {
  constructor(index, previousHash, timestamp, ledger, currentHash) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.ledger = ledger;
    this.currentHash = currentHash;
  }

	


}

module.exports = Block;