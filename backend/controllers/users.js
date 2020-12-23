const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ErrorRequest, ErrorNotFound, ErrorConflict, ErrorAuth,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.findUser = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.findByIdUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найдет');
      } else {
        res.send({ data: user });
      }
    })
    .catch((next(new ErrorNotFound('Пользователь не найдет'))));
};

module.exports.createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => {
      if (data.email === req.body.email) {
        throw new ErrorConflict('Данный пользователь уже зарегистрирован');
      }
    });

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        email: req.body.email,
        password: hash,
      })
        .then((user) => {
          console.log(user);
          res.send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'MongoError') {
            next(new ErrorConflict('Данный пользователь уже зарегистрирован'));
          }
          if (err.name === 'ValidationError') {
            next(new ErrorRequest('Некорректные данные'));
          } else {
            next(err);
          }
        });
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => {
      if (!user) {
        throw new ErrorRequest('Некорректные данные');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => {
      if (!avatar) {
        throw new ErrorRequest('Некорректные данные');
      }
      res.send({ data: user.avatar });
    })
    .catch((err) => {
      if (err) {
        next(new ErrorRequest('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByEmail(email, password)
    .then((user) => {
      if (!user) {
        throw new ErrorAuth('Ведены неправильный email или пароль');
      }
      const jwtToken = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' },
      );
      res.send({
        _id: user._id,
        token: jwtToken,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err) {
        next(new ErrorAuth('Ведены неправильный email или пароль'));
      } else {
        next(err);
      }
    });
};
