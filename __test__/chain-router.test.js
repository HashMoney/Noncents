'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const Block = require('../model/block');
const Chain = require('../model/chain');
const faker = require('faker');


const apiURL = `http://localhost:${process.env.PORT}`;

describe('/chain routes', () => {
  beforeAll(server.start);
  afterAll(server.stop);



  describe('get', () => {
    test('post should send a block to another server and respond with 204', () => {
      return superagent.get(`${apiURL}/chain`)
        .then(response => {
          console.log(response.body);
          expect(response.status).toEqual(200);
        });
    });
  });
});
