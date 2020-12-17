const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { usersEmail } = require('../utils/validate');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => usersEmail(v),
    },
    message: (props) => `${props.value} is not valid email`,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => {
        // eslint-disable-next-line no-useless-escape
        const regex = /^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$/gm;
        return regex.test(v);
      },
      message: (props) => `${props.value} is not valid URL`,
    },
  },
});

userSchema.statics.findUserByEmail = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
