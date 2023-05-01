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
    avatar: Joi.string().pattern(/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const joiErrorsGetUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

const joiErrorsUpdateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports = {
  joiErrorsLogin,
  joiErrorsCreateUser,
  joiErrorsGetUserId,
  joiErrorsUpdateUserInfo,
};
