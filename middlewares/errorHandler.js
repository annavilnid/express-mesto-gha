const errorHandler = (err, req, res, next) => {
  if (err.name) {
    res.status(err.code).send({ message: err.message });
  } else {
    res.status(500).send({ message: 'Ошибка Сервера' });
  }
  next();
};

module.exports = { errorHandler };
