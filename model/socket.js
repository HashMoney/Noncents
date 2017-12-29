'use strict';

const mongoose = require('mongoose');

const webSocketSchema = mongoose.Schema({
  address : {type : String, required : true},
});

module.exports = mongoose.model('socket', webSocketSchema);