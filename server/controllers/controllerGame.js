const { User, Room } = require("../models/index");

class ControllerGame {
  static async readRooms(req, res, next) {
    try {
      const foundRoom = await Room.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "FirstUser",
            attributes: { exclude: ["password"] },
          },
          {
            model: User,
            as: "SecondUser",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      res.status(200).json(foundRoom);
    } catch (error) {
      next(error);
    }
  }

  static async createRoom(req, res, next) {
    try {
      const { id: UserId, username } = req.loginInfo;
      const { name, status, password } = req.body;

      if (status == "Private" && !password)
        throw new Error("PASSWORD_REQUIRED");

      const data = await Room.create({
        name,
        status,
        password,
        FirstUserId: UserId,
      });

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async readOneRoom(req, res, next) {
    try {
      const { id } = req.params;
      const foundRoom = await Room.findByPk(id, {
        include: [
          {
            model: User,
            as: "FirstUser",
            attributes: { exclude: ["password"] },
          },
          {
            model: User,
            as: "SecondUser",
            attributes: { exclude: ["password"] },
          },
        ],
      });
      if (!foundRoom) throw new Error("ROOM_NOT_FOUND");

      res.status(200).json(foundRoom);
    } catch (error) {
      next(error);
    }
  }

  static async joinRoom(req, res, next) {
    try {
      const { id: UserId } = req.loginInfo;
      const { id } = req.params;
      const { password } = req.body;

      const foundRoom = await Room.findByPk(id);

      if (foundRoom.status === "Private" && foundRoom.password !== password)
        throw new Error("INVALID_PASSWORD");

      if (foundRoom.FirstUserId === UserId) {
        res.status(200).json({ message: "Reconnect Room" });
      } else {
        await Room.update({ SecondUserId: UserId }, { where: { id } });
        const data = await Room.findByPk(id);
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerGame;
