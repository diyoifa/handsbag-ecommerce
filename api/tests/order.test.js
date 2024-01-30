const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')

const { addProducts, admin, productsInDb, ordersInDb } = require('./helpers')

const api = supertest(app)

let token = null
let userId = null

beforeEach(async () => {
    await Order.deleteMany({})
    await User.deleteMany({})
    await Product.deleteMany({})

    await api.post('/api/auth/register').send(admin)

    const { body } = await api.post('/api/auth/login').send({
        username: admin.username,
        password: admin.password
    })
    // console.log("🚀 ~ body:", body)
    userId = body._doc._id
    token = body.accessToken
    // console.log("🚀 ~ beforeEach ~ token:", token)
    

}, 10000)


describe('when creating orders', () => {
    test('order is created successfully', async () => {
        await addProducts()
        const products = await productsInDb()
        const order = {
            userId: userId,
            products: [
                {
                    productId: products[0].id,
                    quantity: 2
                }
            ],
            amount: 100,
            status: 'pending'
        }
        await api.post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(order)
        .expect(201)

        const orders = await Order.find({})
        expect(orders).toHaveLength(1)
    })
    test('order is not created if user is not authenticated', async () => {
        await addProducts()
        const products = await productsInDb()
        const order = {
            userId: userId,
            products: [
                {
                    productId: products[0].id,
                    quantity: 2
                }
            ],
            amount: 100,
            status: 'pending'
        }
        await api.post('/api/orders')
        .send(order)
        .expect(401)
    })
})

describe('when updating orders', () => {
    test('order is updated successfully', async () => {
        await addProducts()
        const products = await productsInDb()
        const order = {
            userId: userId,
            products: [
                {
                    productId: products[0].id,
                    quantity: 2
                }
            ],
            amount: 100,
            status: 'pending'
        }
        await api.post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(order)

        const orders =  await ordersInDb()
        console.log(orders)
        const updatedOrder = {
            userId: userId,
            products: [
                {
                    productId: products[0].id,
                    quantity: 2
                }
            ],
            amount: 100,
            status: 'delivered'
        }

        await api.put(`/api/orders/${orders[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedOrder)
        .expect(200)
        const ordersAfterUpdate = await ordersInDb()
        expect(ordersAfterUpdate[0].status).toBe('delivered')
    })
})