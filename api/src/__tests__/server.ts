import { server } from '../server';
var W3CWebSocket = require('websocket').w3cwebsocket;

const supertest = require('supertest');
const requestWithSupertest = supertest(server);

const PORT = process.env.PORT || 4040;

describe('server', () => {
  it('should resolve with not 200, since route does not exist', async () => {
    const response = await requestWithSupertest.get('/bad')
    expect(response).not.toEqual({ statusCode: 200 })
  })

  it('should resolve with true if connection is established to api ', async () => {
    var connection = new Promise((resolve, reject) => {
      var client = new W3CWebSocket(`ws://localhost:${PORT}/counter?interval=2`);

      client.onerror = function (err) {
        resolve(err)
      };

      client.onopen = function () {
        resolve(true)
      };
    });

    const res = await connection
    expect(res).toEqual(true)
  })

  it('should resolve message if connection received first message', async () => {
    var connection = new Promise((resolve, reject) => {
      var client = new W3CWebSocket(`ws://localhost:${PORT}/counter?interval=1`);

      client.onerror = function (err) {
        resolve(err)
      };

      client.onmessage = function (e) {
        resolve(JSON.parse(e.data))
      };
    });

    const res = await connection
    expect(res).toEqual({ message: "Tracked [Number:Counter]: None" })
  })
})

console.log("done??")
