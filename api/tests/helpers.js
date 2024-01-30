const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')

const initialUsers = [
    {
        username: 'test',
        email: 'test@gmail.com',
        password: 'password'
    },
    {
        username: 'test2',
        email: 'test2@gmail.com',
        password: 'password'
    },
    {
        username: 'test3',
        email: 'test3@gmail.com',
        password: 'password'
    }
]

const initialProducts = [
    {
        title: 'Bag1',
        desc: 'bag description',
        img: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amazon.in%2FFargo-Leather-Latest-Handbags-GREY_EMBDRY_FGO-256%2Fdp%2FB08T7BDMZM&psig=AOvVaw2y0QImvPl2El45O3yz3eV1&ust=1706456874305000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCP3Nb1_YMDFQAAAAAdAAAAABAE',
        categories: ['bag', 'women', 'accessories'],
        size: ['small', 'medium', 'large'],
        color: ['black', 'white', 'red'],
        price: 10,
        inStock: true
    },
    {
        title: 'Bag2',
        desc: 'bag description',
        img: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.purpink.co.ke%2Fblogs%2Fblog%2Fhandbags-for-every-lady-a-guide-to-choosing-the-ideal-accessory&psig=AOvVaw2y0QImvPl2El45O3yz3eV1&ust=1706456874305000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNCP3Nb1_YMDFQAAAAAdAAAAABAJ',
        categories: ['bag', 'women', 'accessories'],
        size: ['small', 'medium', 'large'],
        color: ['black', 'white', 'red'],
        price: 20,
        inStock: true
    }
]



const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

const productsInDb = async () => {
    const products = await Product.find({})
    return products.map(p => p.toJSON())
}

const ordersInDb = async () => {
    const orders = await Order.find({})
    return orders.map(o => o.toJSON())
}

const addProducts = async () => {
    await Product.deleteMany({})
    for (p of initialProducts) {
      let newProduct = new Product(p)
      await newProduct.save()
    }
}

const addUsers = async () => {
    await User.deleteMany({})
    for (u of initialUsers) {
      let newUser = new User(u)
      await newUser.save()
    }
}

const admin = {
    username: 'admin',
    email: 'admin@gmail.com',
    isAdmin: true,
    password: 'password'
}


module.exports = {
    initialUsers,
    usersInDb,
    initialProducts,
    productsInDb,
    addProducts,
    addUsers,
    admin,
    ordersInDb
}