const Card = require('../models/cardSchema');
const ValidationError = require('../errors/ValidationError');
const NoAccessError = require('../errors/NoAccessError');
const NotFoundError = require('../errors/NotFoundError');
const {
  // BAD_REQUEST,
  // INTERNAL_SERVER_ERROR,
  STATUS_OK,
  // NOT_FOUND,
} = require('../errors/errors');

const createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректный данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => {
  Card.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((err) => next(err));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById({ _id: cardId })
    .orFail(() => new NotFoundError('Карточка с указанным id не существует'))
    .then((card) => {
      if (!card.owner.equals(userId)) {
        throw new NoAccessError('Карточку может удалить только её создатель');
      }
      return Card.findByIdAndRemove({ _id: cardId });
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректный данные'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Пользователь не существует'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Карточка с указанным id не существует'))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new ValidationError('Некорректный данные'));
    } else if (err.statusCode === 404) {
      next(new NotFoundError('Карточка с указанным id не существует'));
    } else {
      next(err);
    }
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Карточка с указанным id не существует'))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new ValidationError('Некорректный данные'));
    } else if (err.statusCode === 404) {
      next(new NotFoundError('Карточка с указанным id не существует'));
    } else {
      next(err);
    }
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
