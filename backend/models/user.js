const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: (props) => `${props.value} is not valid email`,
    },
  },
  password: {
    type: String,
    select: false,
    required: true,
    validate: {
      validator(v) {
        return /[a-z0-9]*/i.test(v);
      },
      message: 'Пароль некорректен',
    },
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
        const regex = /^(https?\:\/\/)([www\.])*([\w!-\~])*\#?$/i;
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

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
