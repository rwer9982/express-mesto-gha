const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const ValidationError = require('../errors/ValidationError');
const ExistingMailError = require('../errors/ExistingMailError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/NotFoundError');

const {
  // BAD_REQUEST,
  // INTERNAL_SERVER_ERROR,
  STATUS_OK,
  // NOT_FOUND,
  // EXISTING_MAIL,
} = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(STATUS_OK).send(users))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // .orFail(() => new ExistingMailError('Пользователь с таким E-mail уже существует'))
    .then((user) => res.status(STATUS_OK).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректный данные'));
      } else if (err.code === 11000) {
        next(new ExistingMailError('Пользователь с таким E-mail уже существует'));
      } else {
        next(err);
      }
    });
};

const getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.statusCode === 400) {
        next(new ValidationError('Некорректный данные'));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    // .orFail(() => new NotFoundError('Пользователь с указанным id не существует'))
    .then((user) => res.send(user))
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

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Пользователь не существует'))
    .then((user) => res.status(STATUS_OK).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректный данные'));
      } else if (err.statusCode === 404) {
        next(new NotFoundError('Пользователь не существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      // сравниваем переданный пароль и хеш из базы
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        })
        .then(() => {
          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );
          console.log(token);
          res.status(STATUS_OK).send({ message: 'Успешный вход', token });
        })
        .catch((err) => {
          if (err.statusCode === 401) {
            next(new AuthError('Неправильные почта или пароль'));
          } else next(err);
        });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new AuthError('Неправильные почта или пароль'));
      } else next(err);
    });
};

const getUserInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(401).send({ message: 'Пользователь не найден' });
      }
      res.status(STATUS_OK).send(user);
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
  login,
  getUserInfo,
};
