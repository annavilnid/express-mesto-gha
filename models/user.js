const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
// const isUrl = require('validator/lib/isURL');
// const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    // required: [true, 'Введите имя'],
    default: 'Жак-Ив Кусто',
    // изменено с обязательного поля,
    // теперь это по умолчанию Кусто если пользователем не переданы данные
    minlength: [2, 'Текст должен быть не короче 2 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Текст должен быть короче 30 символов'], // а максимальная — 30 символов
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Текст должен быть не короче 2 символов'],
    maxlength: [30, 'Текст должен быть короче 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'Введите email'],
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен некорректный email',
    },
    unique: true, // e-mail должен быть уникальным
  },
  password: {
    type: String,
    required: [true, 'Введите пароль'],
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
