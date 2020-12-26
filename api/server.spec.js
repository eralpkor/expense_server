const supertest = require('supertest');
// const { describe } = require('yargs');
const server = require('./server');

describe('GET /', () => {
  it('should return http 200', async () => {
    const res = await supertest(server).get('/');
    expect(res.status).toBe(200);
  });
});