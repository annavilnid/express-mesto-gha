class DuplicateDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DuplicateDataError';
    this.statusCode = 400;
  }
}

module.exports = DuplicateDataError;
