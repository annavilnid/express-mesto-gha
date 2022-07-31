const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { validateCreateUser, validateLogin } = require('./middlewares/validator');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// роуты которым не нужна авторизация
app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);

// роуты которым нужна авторизация
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

// обработчик ошибок celebrate для Joi
app.use(errors());
// обработчик кастомных ошибок
app.use(errorHandler);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница или URL не найдены' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
