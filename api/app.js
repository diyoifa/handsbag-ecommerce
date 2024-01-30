const express = require("express");
const app = express();
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// dotenv.config();
// import { PORT } from "./config/config";
// const PORT = require("./config/config").PORT;
// import { connectDB } from "./config/db";
const connectDB = require("./db");

const userRoute = require("./controllers/user");
const authRoute = require("./controllers/auth");
const productRoute = require("./controllers/product");
const cartRoute = require("./controllers/cart");
const orderRoute = require("./controllers/order");
const stripeRoute = require("./controllers/stripe");
const cors = require("cors");
const errorHandler = require("./utils/middlewares/errorHandler");
const requestLogger = require("./utils/middlewares/requestLogger");
const unknownEndpoint = require("./utils/middlewares/unknownEndpoint");
// mongoose
//   .connect(process.env.MONGO_URL)
//   .then(() => console.log("DB Connection Successfull!"))
//   .catch((err) => {
//     console.log(err);
//   });

connectDB()
// Middlewares

// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } 
//   next(error)
// }

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint' })
// }

app.use(cors());
app.use(express.json());
app.use(requestLogger)

// Routers
app.get("/", (req, res) => {
  res.send("<h1></h1>Welcome to Ecommerce API</h1>");
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app;
// app.listen(PORT || 5000, () => {
//   console.log("Backend server is running on PORT", PORT);
// });