'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
// const httpErrors = require('http-errors'); // For Future Use - Seth
const Chain = require('../model/chain');


const chainRouter = module.exports = new Router();


chainRouter.get('/chain', jsonParser, (request, response, next) => {
  Chain.find({})
    .then(result => {
      response.send(result);
    })
    .catch(next); //TODO: Erors: Throw a proper error here! - Seth
});
