const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { JWT_SECRET = 'key' } = process.env;

const auth = (req, res, next) => {
  // const { authorization } = req.headers;

  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   next(new AuthError('Необходима авторизация'));
  //   return;
  // }

  if (!req.cookies.jwt) {
    next(new AuthError('Необходима авторизация'));
    return;
  }

  // const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // payload = jwt.verify(token, JWT_SECRET);
    payload = jwt.verify(req.cookies.jwt, JWT_SECRET);
  } catch (err) {
    next(new AuthError('неверный токен'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = { auth };
