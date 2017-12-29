'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const httpErrors = require('http-errors');

// const basicAuthMiddleware = require('../lib/basic-auth-middleware');

const socketRouter = module.exports = new Router();

socketRouter.post('/socket', jsonParser, (request, response, next) => {
//TODO: error handling

	WebSocket.create(request.body.serverAddress)
		.then(sockets => response.json({sockets})) //TODO: In the WebSocket schema, return sockets at the end of the create method (after save of new Socket)
		.catch(next);
});

	socketRouter.get('/login', (request, response, next) => {
	//TODO: error handling

	return WebSocket.find({}) //TODO: Need to confirm that this will return all active sockets without requiring a callback function.

		.then(sockets => response.json({sockets}))
		.catch(next);
	});