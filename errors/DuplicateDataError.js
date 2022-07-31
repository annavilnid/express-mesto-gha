class DuplicateDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateDataError';
    this.statusCode = 409;
  }
}

module.exports = DuplicateDataError;
