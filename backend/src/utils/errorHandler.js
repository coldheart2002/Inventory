function sendError(res, error, context = "") {
  console.error(
    `Error in ${context}:`,
    error.response ? error.response.data : error.message
  );
  res.status(500).json({
    status: "error",
    message: error.response
      ? error.response.data.message || JSON.stringify(error.response.data)
      : error.message,
  });
}

module.exports = { sendError };
