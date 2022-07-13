const User = require('../models/user');

const ERROR_CODE = 400;

const NOT_FOUND_CODE = 404;

const SERVER_ERROR_CODE = 500;

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' }));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(ERROR_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ id: req.user._id }, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send({ user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err) {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ id: req.user._id }, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send({ user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err) {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};
