const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    res.status(400).send({ message: err.message });
  } else if (err.name === 'DuplicateDataError') {
    res.status(409).send({ message: err.message });
  } else if (err.name === 'NotFoundError') {
    res.status(404).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка Сервера' });
  }
  next();
};

module.exports = { errorHandler };