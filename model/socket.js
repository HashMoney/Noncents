'use strict';

const mongoose = require('mongoose');
const superagent = require('superagent');

const apiURL = `https://hash-money.herokuapp.com`;

const webSocketSchema = mongoose.Schema({
  address : {type : String, required : true},
});

webSocketSchema.methods.getSockets = function(){
  return superagent.get(`${apiURL}/socket`)
    .then(response => {
      return response.body.sockets;
    });
};

webSocketSchema.methods.postSocket = function(){
  return superagent.post(`${apiURL}/socket`)
    .send(this)
    .then(() =>{
      console.log('socket posted');
      return;
    });
};


module.exports = mongoose.model('socket', webSocketSchema);
