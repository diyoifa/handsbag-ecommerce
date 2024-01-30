const jwt = require("jsonwebtoken");
const { JWT_SEC } = require("../utils/config");
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader)
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // console.log('token', token)
    jwt.verify(token, JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      console.log('req.user.isAdmin', req.user.isAdmin)
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
