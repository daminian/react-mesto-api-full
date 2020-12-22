const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const usersEmail = (v) => validator.isEmail(v);

// eslint-disable-next-line no-useless-escape
const regex = /^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$/i;
const method = (value, helpers) => {
  if (value !== regex) {
    return helpers.error('any.invalid');
  }

  return value;
};

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().alphanum().required().min(8),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method, 'custom validation'),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(method, 'custom validation'),
  }),
});

module.exports = {
  usersEmail,
  validateRegistration,
  validateLogin,
  validateId,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateCreateCard,
};
