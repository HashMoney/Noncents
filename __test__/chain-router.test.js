'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
// const apiURL = `http://localhost:${process.env.PORT}`; //Used for local testing
const apiURL = `https://hash-money.herokuapp.com`;

describe('/chain routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('get', () => {
    test('GET should respond with a body of the array of chains and a status of 204', () => {
      return superagent.get(`${apiURL}/chain`)
        .then(response => {
          expect(response.body[0].currentChainArray.length).toBeGreaterThan(1);
          expect(response.status).toEqual(200);
        });
    });

    test(' should respond with a 404 when the route is incorrect', () => {
      return superagent.get(`${apiURL}/chan`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  //TODO: ADD MORE TESTS
});