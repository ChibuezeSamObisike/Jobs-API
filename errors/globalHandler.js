const AppError = require("./app-error");
const ResponseHelper = require("./response-handler");

const logger = console;

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleDuplicateTxIdDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `TxId of ${value} already exists!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  let message;
  if (errors.length > 1) {
    message = "Invalid fields on your request: ";
    message += `${errors.join(". ")}`;
  } else {
    message = errors[0];
  }
  return new AppError(message, 400);
};

// const sendErrDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

const handleJWTError = () => {
  return new AppError("Inavlid token. Please login again!", 401);
};
const handleJWTExpiredError = () => {
  return new AppError("Your token has expired, please login again!", 401);
};

const sendError = (err, res) => {
  const { message, statusCode } = err;
  if (err.isOperational) {
    ResponseHelper.sendResponse(res, {
      message,
      statusCode,
    });
  } else {
    logger.error(
      `Server Error ${res.req.headers.reqName} [${res.req.headers.reqName}]`,
      err,
      Object.getOwnPropertyNames(err)
    );
    ResponseHelper.sendResponse(res, {
      message: "Server Error",
      statusCode,
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error;
  error = err;
  if (err.name === "CastError") error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.code === 11000 && err.keyPattern["transactionDetails.txId"] === 1)
    error = handleDuplicateTxIdDB(err);
  if (err.name === "ValidationError") error = handleValidationErrorDB(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  sendError(error, res);

  next();
};

module.exports = globalErrorHandler;
