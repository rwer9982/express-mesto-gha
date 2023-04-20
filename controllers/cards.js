const Card = require('../models/cardSchema');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');

const createCard = (req, res) => {
  console.log(req.user._id);
  const ownerId = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: ownerId })
    .then((card) => Card.populate(card, 'owner'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Произошла ошибка валидации');
      } if ((err.name === 'ServerError')) {
        throw new ServerError('ошибка сервера');
      }
      return res.send({ message: 'ошибка' });
    });
};

const getCards = (req, res) => {
  Card.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Произошла ошибка валидации');
      } if ((err.name === 'ServerError')) {
        throw new ServerError('ошибка сервера');
      }
      return res.send({ message: 'ошибка' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById({ _id: cardId })
    .then(() => Card.findByIdAndRemove({ _id: cardId }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('пользователь не найден');
      }
      return res.send({ message: 'ошибка' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new ValidationError('Произошла ошибка валидации');
    } if (err.name === 'NotFoundError') {
      throw new NotFoundError('пользователь не найден');
    } if ((err.name === 'ServerError')) {
      throw new ServerError('ошибка сервера');
    }
    return res.send({ message: 'ошибка' });
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => res.status(200).send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      throw new ValidationError('Произошла ошибка валидации');
    } if (err.name === 'NotFoundError') {
      throw new NotFoundError('пользователь не найден');
    } if ((err.name === 'ServerError')) {
      throw new ServerError('ошибка сервера');
    }
    return res.send({ message: 'ошибка' });
  });

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
