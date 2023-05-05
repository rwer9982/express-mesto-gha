const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');

router.use('/cards', auth, cardsRouter);
router.use('/users', auth, usersRouter);
router.use('/', auth, (req, res, next) => {
  next(new NotFoundError('ошибка пути'));
});

module.exports = router;
