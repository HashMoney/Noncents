'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const Chain = require('../model/chain');

const util = require('util');

const chainRouter = module.exports = new Router();


chainRouter.get('/chain', jsonParser, (request, response, next) => {
  //TODO: error handling
  Chain.find({})
    .then(result => {
      response.send(result);
    })
    .catch(next);
});
