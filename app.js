const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { NOT_FOUND_CODE } = require('./errors/errors');
const { auth } = require('./middlewares/auth');
// const { errorHandler } = require('./middlewares/errorHandler');
const { validateCreateUser, validateLogin } = require('./middlewares/validator');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);
// авторизация
app.use(auth);
// роуты которым нужна авторизация
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors()); // обработчик ошибок celebrate

// app.use(errorHandler);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая страница или URL не найдены' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
