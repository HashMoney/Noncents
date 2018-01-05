'use strict';

const logger = require('./logger');

module.exports = (error,request,response,next) => {

  logger.log('info','__ERROR_MIDDLEWARE__');
  logger.log('info',error);

  //ERROR CHECKS NEED TO CHECK MESSAGE FOR ERROR HEADER MESSAGE .includes() 
  if(error.status){
    logger.log('info',`Responding with a ${error.status} status and message: ${error.message}`);
    return response.sendStatus(error.status);
  }

  let message = error.message.toLowerCase();
  
  if(message.includes('Not Found')){
    logger.log('info','Responding with a 404 status code');
    return response.sendStatus(404);
  }

  if(message.includes('Bad Request')){
    logger.log('info','Responding with a 400 status code');
    return response.sendStatus(400);
  }

  if(message.includes('Unauthorized')){
    logger.log('info','Responding with a 401 status code');
    return response.sendStatus(401);
  }
  logger.log('info','Responding with a 500 status code');
  logger.log('info',error);
  return response.sendStatus(500);
};