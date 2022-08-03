const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
        return;
      }
      if (card.owner.toString() !== req.user._id.toString()) {
        next(new ForbiddenError('У Вас недостаточно прав на удаление карточки'));
      } else {
        Card.findByIdAndRemove(req.params.cardId)
          .then((data) => {
            res.send({ data });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданны некорректные данные карточки'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
        return;
      }
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан не валидный id'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Указан не валидный id'));
        return;
      }
      next(err);
    });
};
