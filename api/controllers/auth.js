const router = require("express").Router();
const User = require("../models/User");
const {JWT_SEC} = require('../utils/config')
// const CryptoJS = require("crypto-js");
const bcrypt = require('bcrypt')

const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const body = req.body
    const saltRounds = 10
    const password = await bcrypt.hash(body.password, saltRounds)

    admin = false

    if(body.isAdmin){
      admin = true
    }

    const user = new User({
      username: body.username,
      email: body.email,
      isAdmin: admin,
      password,
    })

    const savedUser = await user.save()

    res.json(savedUser)
  } catch (error) {
    // console.log(error)
    next(error)
  }
});


//LOGIN
router.post("/login", async (req, res, next) => {
  try {
    // console.log("bien")
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");

    const validPassword = await bcrypt.compare(req.body.password.toString(), user.password.toString())
    // console.log(validPassword)
    !validPassword && res.status(401).json("Wrong credentials!");
    // const hashedPassword = CryptoJS.AES.decrypt(
    //   user.password,
    //   process.env.PASS_SEC
    // );
    // const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    // OriginalPassword !== req.body.password &&
    //   res.status(401).json("Wrong credentials!");
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      JWT_SEC,
      { expiresIn: "3d" }
    );
    res.status(200).json({ ...user._doc, accessToken });
  } catch (err) {
    // console.log(err)
    next(err)
  }
});

module.exports = router;
