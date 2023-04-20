const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);
router.use('/users', (req, res) => {
  res.status(404).send({ error: 'Ошибка index.js' });
});

module.exports = router;
