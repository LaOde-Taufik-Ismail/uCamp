class ExpressError extends Error {
  constructor(message, status) {
    super(message, status);
    this.massage = message;
    this.status = status;
  }
}

module.exports = ExpressError;
