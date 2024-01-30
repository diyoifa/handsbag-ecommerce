const mongoose = require("mongoose");
// const User = require("./User");
// const Product = require("./Product");
const uniqueValidator = require('mongoose-unique-validator')

const OrderSchema = new mongoose.Schema(
  {
    userId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User', // Aquí 'User' debe ser el nombre del modelo de usuario
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Aquí 'Product' debe ser el nombre del modelo de producto
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    // address: { type: Object, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

OrderSchema.plugin(uniqueValidator)

OrderSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Order", OrderSchema);
