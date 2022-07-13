const Card = require('../models/card');

const ERROR_CODE = 400;

const NOT_FOUND_CODE = 404;

const SERVER_ERROR_CODE = 500;

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: err.message });
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ card }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Id не существует' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Id не существует' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch(() => res.status(ERROR_CODE).send({ message: 'Id не существует' }));
};
