const { Room, User } = require("../models/index");
const authorization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: UserId } = req.loginInfo;

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

    if (
      foundRoom.SecondUser !== null &&
      UserId !== foundRoom.FirstUser.id &&
      UserId !== foundRoom.SecondUser.id
    ) {
      //   console.log(foundRoom.SecondUser);
      throw new Error("FORBIDDEN");
    }
    // console.log(UserId);
    // console.log(foundRoom);

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authorization;
