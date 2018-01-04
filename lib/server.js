'use strict';

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const Chain = require('../model/chain');

const app = express();
let isServerOn = false;
let httpServer = null;
let stableChain = null;
// -----------------------------------
//Setting up MongoDB and Mongoose
// -----------------------------------
mongoose.Promise = Promise;
// mongoose.connect(process.env.MONGODB_URI, {useMongoClient : true});

// -----------------------------------
//Setting up routes below
// -----------------------------------
app.use(require('./logger-middleware'));

app.use(require('../route/socket-router'));
app.use(require('../route/block-router'));
app.use(require('../route/chain-router'));

//the catch-all should be at the end of all routes

app.all('*', (request, response) => {
  logger.log('info', 'Returning a 404 from the catch all route.');
  return response.sendStatus(404);
});
// -----------------------------------
// ERROR MIDDLEWARE
// -----------------------------------
// app.use(require('./error-middleware'));

const server = module.exports = {};

server.start = () => {
  return new Promise((resolve,reject) => {
    if(isServerOn){
      logger.log('error', '__SERVER_ERROR__ server is already on');
      return reject(new Error('__SERVER_ERROR__ server is already on'));
    }
    httpServer = app.listen(process.env.PORT, () => {
      isServerOn = true;
      console.log(`Server is linstening on port ${process.env.PORT}`);
      logger.log('info', `Server is linstening on port ${process.env.PORT}`);
      return resolve();
    });
  })
    .then(() => {
      mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
    });
    
};


// .then( () => {
//   console.log('Cleared chain history from DB');
//   Chain.collection.remove({});
// });

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!isServerOn){
      logger.log('error', '__SERVER_ERROR__ server is already off');
      return reject(new Error('__SERVER_ERROR__ server is already off'));
    }
    if(!httpServer){
      logger.log('error', '__SERVER_ERROR__ there is no server to close');
      return reject(new Error('__SERVER_ERROR__ there is no server to close'));
    }
    httpServer.close(() => {
      isServerOn = false;
      httpServer = null;
      logger.log('info', 'Server is off');
      return resolve();
    });
  })
    .then(() => mongoose.disconnect());
};
