const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: [true, 'Введите имя'], // оно должно быть у каждого пользователя, так что имя — обязательное поле
    minlength: [2, 'Текст должен быть не короче 2 символов'], // минимальная длина имени — 2 символа
    maxlength: [30, 'Текст должен быть короче 30 символов'], // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: [true, 'Введите информацию о себе'],
    minlength: [2, 'Текст должен быть не короче 2 символов'],
    maxlength: [30, 'Текст должен быть короче 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Введите URL аватара'],
  },
});

module.exports = mongoose.model('user', userSchema);
