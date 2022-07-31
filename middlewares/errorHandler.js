const { NOT_FOUND_CODE } = require('../errors/errors');

const errorHandler = (err, req, res, next) => {
  if (err.name === 'BadRequestError') {
    res.send({ message: err.message });
  } else if (err.name === 'DuplicateDataError') {
    res.send({ message: err.message });
  } else if (err.name === 'NotFoundError') {
    res.send({ message: err.message });
  } else if (err.name === 'ForbiddenError') {
    res.send({ message: err.message });
  } else {
    res.status(NOT_FOUND_CODE).send({ message: 'Ошибка Сервера' });
  }
  next();
};

module.exports = { errorHandler };
