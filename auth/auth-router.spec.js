const server = require('../api/server');
const request = require('supertest');
const db = require('../database/dbConfig');
const Users = require('./middleware/auth-model');

const bcrypt = require('bcryptjs');
require('dotenv').config();

beforeAll(async () => {
  // run the migrations and do any other setup here
  await db.migrate.latest()
});

let token;
beforeAll(async (done) => {
  request(server)
    .post('/auth/login')
    .send({
      username: 'test_user',
      password: 'Password1'
    })
    .end((err, response) => {
      token = response.body.token; // save the token
      done();
    })
})

// beforeEach(() => db.seed.run());

describe('new user authentication', () => {
  beforeEach(async () => {
    await db('users').truncate()
  })
  it('should have response body', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({
        username: 'test_user',
        password: 'Password1',
        email: 'testing@testing.com'
      })
      
      expect(response.status).toBe(201);
      expect(response.type).toMatch(/json/i);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('token');
  });
  it('should create a user', async () => {
    const response = await request(server)
      .post('/auth/register')
      .send({
        username: 'test_user',
        password: 'Password1',
        email: 'testing@testing.com'
      });

    expect(response.body.user.username).toBe('test_user')
    expect(response.body.user.email).toBe('testing@testing.com')
  })
});

describe('login user', () => {
  it('should login existing user', async () => {
    const response = await request(server)
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'Password1'
    });

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('Welcome back test_user');
    expect(response.body.user).toBe('test_user');
    expect(response.body).toHaveProperty('token');
  });
  
  it('should check for password match', async () => {
    const userLogin = {
      username: 'test_user',
      password: 'Password1'
    }
    const response = await request(server)
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'Password1'
    });
    const username = userLogin.username;
    // console.log(username)

    expect(response.status).toBe(200);

    Users.findBy({ username })
      .then(([user]) => {
        // check hashed password
        expect(bcrypt.compareSync(userLogin.password, user.password)).toBeTruthy()
      })

  })
});

describe('User authentication, token', () => {
  it('should pass authentication', async () => {
    const response =   request(server)
      .put('/auth/update')
      .set('Authorization', token)

    expect(typeof response.header.Authorization).toBeTruthy()
  });
});

// test("select users", async () => {
//   let users = await db.from("users").select("username")
//   expect(users.length).toEqual(3)
//   console.log(users.length)
// })