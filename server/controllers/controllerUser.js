const { comparePassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models/index");

class ControllerUser {
  static async Register(req, res, next) {
    try {
      const { username, password } = req.body;

      const data = await User.create({ username, password });

      res.status(201).json({
        id: data.id,
        username: data.username,
      });
    } catch (error) {
      next(error);
    }
  }

  static async Login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) throw new Error("USER_REQUIRED");

      const foundUser = await User.findOne({ where: { username } });

      if (!foundUser) throw new Error("INVALID_USER");

      const validatePassword = comparePassword(password, foundUser.password);

      if (!validatePassword) throw new Error("INVALID_USER");

      const payload = {
        id: foundUser.id,
        username: foundUser.username,
      };

      const access_token = createToken(payload);

      res.status(200).json({
        access_token,
        username: foundUser.username,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerUser;
