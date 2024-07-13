const sendResponse = (res, statusCode, success, message, data) => {
  res.status(statusCode).json({
    success: success,
    message,
    data,
  });
};

const sendSuccess = (
  res,
  data,
  message = "Success",
  statusCode = 200,
  success = true
) => {
  sendResponse(res, statusCode, success, message, data);
};

const sendError = (
  res,
  message = "An error occurred",
  statusCode = 500,
  success = false
) => {
  sendResponse(res, statusCode, success, message);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
};
