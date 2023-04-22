const Card = require('../models/cardSchema');
// const ValidationError = require('../errors/ValidationError');
// const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  STATUS_OK,
  NOT_FOUND,
} = require('../errors/errors');

const createCard = (req, res) => {
  console.log(req.user._id);
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => Card.populate(card, 'owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'ошибка' }));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then(() => Card.findByIdAndRemove({ _id: cardId }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
      } if (err.statusCode === 404) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не существует' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } if (err.statusCode === 404) {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не существует' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
  .then((card) => res.status(STATUS_OK).send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Некорректные данные' });
    } if (err.statusCode === 404) {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не существует' });
    } else {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' });
    }
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
