const supertest = require('supertest')
const app = require('../app')
// const initialUsers = require('./helpers').initialUsers
// const usersInDb = require('./helpers').usersInDb
// const addUsers = require('./helpers').addUsers
const { 
    addUsers,
    usersInDb, 
} = require('./helpers')

const api = supertest(app)

let token = null

beforeEach(async () => {
    await addUsers()
    const userAdmin = {
        username: 'admin',
        email: 'admin@gmail.com',
        isAdmin: true,
        password: 'password'
    }
    await api.post('/api/auth/register').send(userAdmin)
    const {body} = await api.post('/api/auth/login').send({
        username: userAdmin.username,
        password: 'password'
    })
    token = body.accessToken
}, 15000)

describe('when getting users', () => {
    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('single user is returned as json', async () => {
        const users = await usersInDb()
        const user = users[0]
        await api
            .get(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('get users fails with statuscode 401 if token is not provided', async () => {
        await api
            .get('/api/users')
            .expect(401)
    })
})

describe('when updating users', () => {
    test('update user succeeds with statuscode 200', async () => {
        const users = await usersInDb()
        const user = users[0]
        const updatedUser = {
            username: 'newUsername',
            password: 'newPassword',
        }
        newUser =  await api
            .put(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedUser)
            .expect(200)
        
        expect(newUser.body.username).toBe(updatedUser.username)
    })
})

describe('when deleting users', () => {
    test('delete user succeeds with statuscode 200', async () => {
        const users = await usersInDb()
        const user = users[0]
        await api
            .delete(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })
})

