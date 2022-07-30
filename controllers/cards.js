const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ValidationError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (owner.toString() !== req.user._id.toString()) {
    Card.create({ name, link, owner })
      .then((card) => res.status(201).send({ card }))
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        next(err);
      });
  }
};

module.exports.deleteCard = (req, res, next) => {
  console.log(req.user._id);
  Card.findById(req.params.id)
    .then((card) => {
      console.log(card);
      if (card.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      } else {
        Card.findByIdAndRemove(req.params.id)
          .then((cards) => {
            res.send(cards);
          })
          .catch((error) => {
            if (error.name === 'CastError') {
              next(new ValidationError('Карточка с id не найдена'));
            }
            next(error);
          })
          .catch(next);
      }
    })
    .catch(next);
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
