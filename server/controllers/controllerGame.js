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
      const { name } = req.body;
      // const{password, status} = req.body;

      const status = "Waiting for 2nd player";

      const data = await Room.create({
        name,
        status,
        password: "",
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
      // const { password } = req.body;

      const foundRoom = await Room.findByPk(id);

      // if (foundRoom.status === "Private" && foundRoom.password !== password)
      //   throw new Error("INVALID_PASSWORD");

      if (foundRoom.FirstUserId === UserId) {
        res.status(200).json({ message: "Reconnect User" });
      } else {
        await Room.update(
          { SecondUserId: UserId, status: "Battling" },
          { where: { id } }
        );
        const data = await Room.findByPk(id, {
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
        res.status(200).json(data);
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateRoom(req, res, next) {
    try {
      const { id } = req.params;
      const { history, winner, status } = req.body;

      const foundRoom = await Room.findByPk(id);

      if (!foundRoom) throw new Error("ROOM_NOT_FOUND");

      await Room.update({ history, winner, status }, { where: { id } });

      const data = await Room.findByPk(id);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async updateWinner(req, res, next) {
    try {
      const { id } = req.params;
      const { winner, status } = req.body;

      let foundRoom = await Room.findByPk(id, {
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

      let win = "";
      if (winner !== "draw") {
        const FirstUserId = foundRoom.FirstUserId;
        const FirstUserMmr = foundRoom.FirstUser.mmr;
        const SecondUserId = foundRoom.SecondUserId;
        const SecondUserMmr = foundRoom.SecondUser.mmr;
        if (winner === "white") {
          win = foundRoom.FirstUser.username;
          await User.update(
            { mmr: FirstUserMmr + 25 },
            { where: { id: FirstUserId } }
          );
          await User.update(
            { mmr: SecondUserMmr - 25 },
            { where: { id: SecondUserId } }
          );
        } else if (winner === "black") {
          win = foundRoom.SecondUser.username;
          await User.update(
            { mmr: FirstUserMmr - 25 },
            { where: { id: FirstUserId } }
          );
          await User.update(
            { mmr: SecondUserMmr + 25 },
            { where: { id: SecondUserId } }
          );
        }
      } else {
        win = "Draw";
      }

      await Room.update({ winner: win, status }, { where: { id } });

      foundRoom = await Room.findByPk(id, {
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

  static async leaderBoard(req, res, next) {
    try {
      const data = await User.findAll({ order: [["mmr", "DESC"]] });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerGame;
