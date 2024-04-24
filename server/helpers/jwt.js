const jwt = require("jsonwebtoken");
const SECRETKEY = process.env.SECRETKEY;

const createToken = (payload) => {
  return jwt.sign(payload, SECRETKEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRETKEY);
};

module.exports = { createToken, verifyToken };
