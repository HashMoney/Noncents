'use strict';

const mongoose = require('mongoose');

const chainSchema = mongoose.Schema({
  root: { type: Object, required: true },
});

module.exports = mongoose.model('chain', chainSchema);