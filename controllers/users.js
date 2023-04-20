const User = require('../models/userSchema');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');

// const SUCCESS = 200;
// const BAD_REQUEST = 400;

const getUsers = (req, res) => {
  User.find({})
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Произошла ошибка валидации');
      } if ((err.name === 'ServerError')) {
        throw new ServerError('ошибка сервера');
      }
      return res.send({ message: 'ошибка' });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('пользователь не найден');
      } if ((err.name === 'ServerError')) {
        throw new ServerError('ошибка сервера');
      }
      return res.send({ message: 'ошибка' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findOneAndUpdate({ name, about })
    .then((user) => res.send(user))
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
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findOneAndUpdate({ avatar })
    .then((user) => res.status(200).send(user))
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
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
};
