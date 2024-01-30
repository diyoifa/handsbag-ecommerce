const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/User')
const app = require('../app')
const initialUsers = require('./helpers').initialUsers

const api = supertest(app)

let userAtStart = initialUsers[0]

beforeEach(async () => {
  await User.deleteMany({})
  //   let userAtStart = initialUsers[0]
  // console.log(userAtStart)
  let { body } = await api.post('/api/auth/register').send(userAtStart)
  // console.log(body)

}, 10000)

describe('when there is initially one user in db', () => {
  test('login succeeds with a fresh username', async () => {
    await api
      .post('/api/auth/login').send({
        username: 'test',
        password: 'password'
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    // console.log(body)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {

    let { error } = await api
      .post('/api/auth/register').send(userAtStart)
      .expect(400)
    //  .expect(400)
    expect(error.text).toContain('`username` to be unique')
    //  expect(error.body.error).toContain('`username` to be unique')
  })
})

afterAll(() => {
  mongoose.connection.close()
})