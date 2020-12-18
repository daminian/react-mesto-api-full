const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ErrorRequest, ErrorNotFound, ErrorAuth } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.findUser = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.findByIdUser = (req, res, next) => {
  User.findOne({ _id: req.params._id })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найдет');
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({ _id: user._id, email: user.email }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.params._id)
    .then((user) => {
      if (!user) {
        throw new ErrorRequest('Некорректные данные');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.params._id)
    .then((avatar) => {
      if (!avatar) {
        throw new ErrorRequest('Некорректные данные');
      }
      res.send({ data: avatar });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorAuth('Ошибка авторизации');
  }
  const id = jwt.verify(
    token,
    NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
  );
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, password)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      const jwtToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.send({
        _id: user._id,
        token: jwtToken,
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
