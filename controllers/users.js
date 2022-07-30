const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  CREATED_CODE,
} = require('../errors/errors');
const { BadRequestError } = require('../errors/BadRequestError');
const ServerError = require('../errors/server-error');
const ValidationError = require('../errors/ValidationError');
const DuplicateDataError = require('../errors/DuplicateDataError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  // хешируем пароль
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED_CODE).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else if (err.code === 11000) {
        next(new DuplicateDataError('Указанный email уже есть в базе данных'));
      }
      next(err);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, { sameSite: true, httpOnly: true });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => new ServerError('Ошибка сервера'));
};

module.exports.getUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.send({ user }))
    .catch(() => new ServerError('Ошибка сервера'));
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Запрашиваемый пользователь по указанному id не найден'));
      }
      res.send(user);
    })
    .catch(() => next(new ValidationError('Id не существует')));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findOneAndUpdate({ id: req.user._id }, { name, about }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return new NotFoundError('Запрашиваемый пользователь по указанному id не найден');
      }
      res.send({ user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные пользователя');
      }
      throw new ServerError('Ошибка сервера');
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findOneAndUpdate({ id: req.user._id }, { avatar }, { new: true, runValidators: true })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return new NotFoundError('Запрашиваемый пользователь по указанному id не найден');
      }
      res.send({ user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные пользователя');
      }
      throw new ServerError('Ошибка сервера');
    });
};
