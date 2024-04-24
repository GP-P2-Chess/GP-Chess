const { User } = require("../models/index");
const { verifyToken } = require("../helpers/jwt");

const Authentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new Error("INVALID_TOKEN");
    const token = authorization.split(" ")[1];
    const payload = verifyToken(token);

    const { id } = payload;
    const foundUser = await User.findByPk(id);

    if (!foundUser) throw new Error("INVALID_TOKEN");

    req.loginInfo = {
      id: foundUser.id,
      username: foundUser.username,
    };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = Authentication;
