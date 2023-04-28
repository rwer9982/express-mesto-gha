const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { auth } = require('../middlewares/auth');

const {
  NOT_FOUND,
} = require('../errors/errors');

router.use('/cards', auth, cardsRouter);
router.use('/users', auth, usersRouter);
router.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ошибка пути' });
});

module.exports = router;
