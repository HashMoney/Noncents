'use strict';

require('./lib/setup');

const server = require('../lib/server');
const superagent = require('superagent');
const WebSocket = require('../model/socket');
let webSocketRemove = () => WebSocket.remove({});

// const apiURL = `http://localhost:${process.env.PORT}`;
const apiURL = `https://hash-money.herokuapp.com`;


describe('/socket routes', () => {
  beforeAll(server.start);
  afterEach(webSocketRemove);
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

  describe('get', ()=> {
    test('get should retrieve the sockets from the server if no error', () => {
      let addressToTest = {address : '209.210.157.165:9999'};
      return superagent.post(`${apiURL}/socket`)
        .send(addressToTest)
        .then(() => {
          return superagent.get(`${apiURL}/socket`)
            .then(response => {
              console.log(response.body);
              expect(response.body.sockets[0].address).toContain('209.210.157.165:9999');
            });

        });
    });
  });

});
