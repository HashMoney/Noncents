'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const apiURL = `https://hash-money.herokuapp.com`;


describe('/chain routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('get', () => {
    test('GET should respond with a body of the array of chains and a status of 204', () => {
      return superagent.get(`${apiURL}/chain`)
        .then(response => {
          expect(response.status).toEqual(200);
        });
    });
  });
});
