'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/socket routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  describe('post', ()=> {
    test('post should post to the server and response should be 204 if no error', () => {
      let address = {address : '209.210.157.165:7777'};

      return superagent.post(`${apiURL}/socket`)
        .send(address)
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
