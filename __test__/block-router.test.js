'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Block = require('../model/block');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/block routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  let mockBlock = new Block (1, 'one', new Date(), 'ledger', 'asdfgasdfasdgasdf');

  describe('post', ()=> {
    test('post should send a block to another server and respond with 204', () => {
      return superagent.post(`${apiURL}/block`)
        .send(mockBlock)
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });
  });
});
