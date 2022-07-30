const Card = require('../models/card');
const { ERROR_CODE, SERVER_ERROR_CODE } = require('../errors/errors');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ValidationError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      next(err);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params.id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError(`Карточка  с указанным id: ${cardId} не найдена`));
      }
      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      } else {
        Card.findByIdAndRemove(cardId)
          .then((data) => {
            res.send(data);
          })
          .catch((error) => {
            if (error.name === 'CastError') {
              throw new ValidationError(`Карточка с id:${cardId} не найдена`);
            }
            next(error);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.delet = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
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
        res.status(ERROR_CODE).send({ message: err.message });
        return;
      }
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError({ message: err.message }));
      }
    });
};
