const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard, validateCardId } = require('../middlewares/validator');

router.post('/', validateCreateCard, createCard);

router.get('/', validateCardId, getCards);

router.delete('/:cardId', validateCardId, deleteCard);

router.put('/:cardId/likes', validateCardId, likeCard);

router.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = router;
