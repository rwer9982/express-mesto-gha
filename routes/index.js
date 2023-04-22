const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const {
  NOT_FOUND,
} = require('../errors/errors');

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ошибка пути' });
});

module.exports = router;
