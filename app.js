require('dotenv').config();
const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
// const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { joiErrorsCreateUser, joiErrorsLogin } = require('./errors/joiErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const auth = require('./middlewares/auth');

const { PORT = 3001 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  //  useNewUrlParser: true,
  //  useCreateIndex: true,
  //  useFindAndModify: false,
});

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
  'https://localhost:3000',
  'http://localhost:3000',
  'localhost:3001',
  'https://localhost:3001',
  'http://localhost:3001',
];

app.use(cors(allowedCors));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// app.use(cookieParser);
app.post('/signin', joiErrorsLogin, login);
app.post('/signup', joiErrorsCreateUser, createUser);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  console.log('next: ', next);
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
