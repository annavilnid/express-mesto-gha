const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
// const ForbiddenError = require('../errors/ValidationError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        res.status(201).send({ card });
      }
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        res.status(403).send({ message: 'У Вас нет прав на удаление' });
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((data) => {
            if (!data) {
              res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
            }
            if (data.owner.toString() === req.user._id.toString()) {
              res.status(200).send({ data });
            }
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(400).send({ message: err.message });
            }
            res.status(500).send({ message: 'Ошибка сервера' });
          });
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(111).send({ message: err.message });
        return;
      }
      res.status(111).send({ message: 'Ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      res.status(200).send(card);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new ValidationError('Карточка не найдена');
      }
      next(error);
    });
};
