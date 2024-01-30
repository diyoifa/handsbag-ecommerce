const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/User')
const Product = require('../models/Product')
const app = require('../app')

// const initialUsers = require('./helpers').initialUsers
// const initialProducts = require('./helpers').initialProducts
// const productsInDb = require('./helpers').productsInDb
// const addProducts = require('./helpers').addProducts

const {
  initialUsers,
  initialProducts,
  productsInDb,
  addProducts
}  = require('./helpers')

const api = supertest(app)

let userAtStart = initialUsers[0]
let productAtStart = initialProducts[0]
let token = null

beforeEach(async () => {
    await User.deleteMany({})
    await Product.deleteMany({})
  //   let userAtStart = initialUsers[0]
    // console.log(userAtStart)
    let {body} = await api.post('/api/auth/register').send({...userAtStart, isAdmin: true})
    // console.log(body)

    let response = await api.post('/api/auth/login').send({
        username: body.username,
        password: 'password'  
      })
    // console.log(response.body.accessToken)
    token = response.body.accessToken
    
    
      
  }, 10000)

describe('when creating a product', () => {
    test('creation succeeds with valid data', async () => {
        await api
          .post('/api/products')
          .send(productAtStart)
          .set('Authorization', `Bearer ${token}`)
          .expect(201)
          .expect('Content-Type', /application\/json/)
    })

    test('creation fails if user is not admin or logged in', async () => {
        await api
          .post('/api/products')
          .send(productAtStart)
          .expect(401)
          .expect('Content-Type', /application\/json/)
    })

})

describe('when getting products', () => {
  beforeEach(async () => {
  //   await Product.deleteMany({})
  //   for (p of initialProducts) {
  //     let newProduct = new Product(p)
  //     await newProduct.save()
  //   }
    await addProducts()
  }, 10000)

    test('all products are returned', async () => {
        await api
          .get('/api/products')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })

    test('a single product is returned', async () => {
        const products = await productsInDb()
        const productToFind = products[0]
        await api
          .get(`/api/products/${productToFind.id}`)
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })
})

describe('when updating a product', () => {
  beforeEach(async () => {
    await addProducts()
  }, 10000)

  test('update succeeds with valid data', async () => {
    const products = await productsInDb()
    const productToUpdate = products[0]
    await api
      .put(`/api/products/${productToUpdate.id}`)
      .send({title: 'new title'})
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('update fails if user is not admin or logged in', async () => {
    const products = await productsInDb()
    const productToUpdate = products[0]
    await api
      .put(`/api/products/${productToUpdate.id}`)
      .send({title: 'new title'})
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('when deleting a product', () => {
  beforeEach(async () => {
    await addProducts()
  }, 10000)

  test('delete succeeds with valid data', async () => {
    const products = await productsInDb()
    const productToDelete = products[0]
    await api
      .delete(`/api/products/${productToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('delete fails if user is not admin or logged in', async () => {
    const products = await productsInDb()
    const productToDelete = products[0]
    await api
      .delete(`/api/products/${productToDelete.id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})