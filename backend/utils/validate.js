const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const usersEmail = (v) => validator.isEmail(v);

const validateRegistration = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  usersEmail,
  validateRegistration,
  validateLogin,
};
