'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');
const WebSocket = require('../model/socket');

// const basicAuthMiddleware = require('../lib/basic-auth-middleware');

const socketRouter = module.exports = new Router();

socketRouter.post('/socket', jsonParser, (request, response, next) => {
//TODO: error handling
  return new WebSocket({
    address: request.body.address,
  }).save()
		.then(() => response.sendStatus(204)) //TODO: In the WebSocket schema, return sockets at the end of the create method (after save of new Socket)
		.catch(next);
});

	socketRouter.get('/socket', (request, response, next) => {
	//TODO: error handling

	return WebSocket.find({}) //TODO: Need to confirm that this will return all active sockets without requiring a callback function.

		.then(sockets => response.json({sockets}))
		.catch(next);
	});