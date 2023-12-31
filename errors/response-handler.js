const logger = console;

class ResponseHelper {
  static OK = 200;
  static RESOURCE_CREATED = 201;
  static ACCEPTED = 202;
  static NO_CONTENT = 204;
  static UNAUTHORIZED = 401;
  static RESOURCE_NOT_FOUND = 404;
  static BAD_REQUEST = 400;
  static FORBIDDEN = 403;
  static INTERNAL_SERVER_ERROR = 500;

  static sendResponse(res, { message, data, statusCode }) {
    const body = {
      status:
        statusCode <= 199
          ? "info"
          : statusCode > 199 && statusCode <= 299
          ? "success"
          : statusCode > 299 && statusCode <= 399
          ? "redirection"
          : statusCode > 399 && statusCode <= 499
          ? "fail"
          : "error",
    };
    4;
    if (message) body.message = message;
    if (data) body.data = data;
    const { reqName, reqId } = res.req.headers;
    logger.info(`Responded to ${reqName} request [${reqId}]`, {
      response: { body },
      code: statusCode,
    });
    res.status(statusCode).json(body);
  }

  static sendSuccessResponse(res, { message, data, statusCode }) {
    ResponseHelper.sendResponse(res, {
      message,
      data,
      statusCode: statusCode || ResponseHelper.OK,
    });
  }
}

module.exports = ResponseHelper;
