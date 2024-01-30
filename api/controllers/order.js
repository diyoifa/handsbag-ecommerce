const Order = require("../models/Order");

const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res, next) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err)
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    next(err)
  }
});

//GET USER ORDERS
router.get("/:userId", verifyTokenAndAuthorization, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
    .populate('userId')
    .populate({
      path: 'products.productId',
      model: 'Product'
    });
    res.status(200).json(orders);
  } catch (err) {
    next(err)
  }
});

// //GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find()
    .populate('userId')
    .populate({
      path: 'products.productId',
      model: 'Product'
    });
    res.status(200).json(orders);
  } catch (err) {
    next(err)
  }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res, next) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
