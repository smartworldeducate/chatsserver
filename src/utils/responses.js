function sendSuccess(res, data, message = 'Success', status = 200) {
  res.status(status).send({ success: true, message, data });
}

function sendError(res, error) {
  const statusCode = error?.status_code || 500;
  const type = error?.type || 'Bad Request';
  const message = error?.custom_msg || error?.message || 'Something went wrong';
  res.status(statusCode).send({ success: false, error: type, message });
}

module.exports = { sendSuccess, sendError };
