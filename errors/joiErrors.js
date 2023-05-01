const { celebrate, Joi } = require('celebrate');

const joiErrorsLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const joiErrorsCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  joiErrorsLogin,
  joiErrorsCreateUser,
//  joiErrorsCreateCard,
//  joiErrorsUpdateUserAvatar,
};
