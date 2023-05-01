const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { joiErrorsCreateUser } = require('./errors/joiErrors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  //  useNewUrlParser: true,
  //  useCreateIndex: true,
  //  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '64409338eba44725e5b3fa98',
//   };
//  next();
// });

app.post('/signin', login);
app.post('/signup', joiErrorsCreateUser, createUser);
app.use(errors());

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
