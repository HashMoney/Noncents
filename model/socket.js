'use strict';

const mongoose = require('mongoose');

const socketSchema = mongoose.Schema({
  address : {type : String, required : true},
});

module.exports = mongoose.model('socket', socketSchema);