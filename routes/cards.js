const cardRouter = require('express').Router();
const { joiErrorsCreateCard, joiErrorsFindCardId } = require('../errors/joiErrors');
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.post('/', joiErrorsCreateCard, createCard);
cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', joiErrorsFindCardId, deleteCard);
cardRouter.put('/:cardId/likes', joiErrorsFindCardId, likeCard);
cardRouter.delete('/:cardId/likes', joiErrorsFindCardId, dislikeCard);

module.exports = cardRouter;
