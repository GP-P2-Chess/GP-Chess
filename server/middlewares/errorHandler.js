const ErrorHandler = (err, req, res, next) => {
  let code = 500;
  let message = "Internal Server Error";
  console.log(err);
  if (err.name == "SequelizeValidationError") {
    code = 400;
    message = err.errors[0].message;
  }
  if (err.name == "SequelizeUniqueConstraintError") {
    code = 400;
    message = err.errors[0].message;
  }
  if (err.message == "USER_REQUIRED") {
    code = 400;
    message = "Username/Password is required";
  }
  if (err.message == "INVALID_USER") {
    code = 401;
    message = "Username/Password is invalid";
  }
  if (err.message == "INVALID_TOKEN") {
    code = 401;
    message = "Invalid Token";
  }
  if (err.name === "JsonWebTokenError") {
    code = 401;
    message = "Error authentication";
  }
  if (err.message == "ROOM_NOT_FOUND") {
    code = 404;
    message = "Room Not Found";
  }
  if (err.message == "FORBIDDEN") {
    code = 403;
    message = "Forbidden";
  }

  res.status(code).json({ message });
};

module.exports = ErrorHandler;
