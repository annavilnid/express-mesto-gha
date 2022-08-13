const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { corsHandler } = require('./middlewares/corsHandler');
const { validateCreateUser, validateLogin } = require('./middlewares/validator');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

// const corsOptions = {
//  origin: ['http://localhost:3000'],
//  credentials: true,
// };

// app.use('*', cors(corsOptions));

// app.use(cors({
//  origin: ['https://mesto.project.nomoredomains.sbs', 'http://mesto.project.nomoredomains.sbs', 'http://localhost:3000', 'http://127.0.0.1:3000'],
// credentials: true,
// }));

// app.options('*', cors())

app.use(corsHandler); // обработаем CORS-запросы

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use(requestLogger); // подключаем логгер запросов

// тестирование падение сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// роуты которым не нужна авторизация
app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);

// роуты которым нужна авторизация
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница или URL не найдены'));
  // eslint-disable-next-line no-useless-return
  return;
});

// обработчик ошибок celebrate для Joi
app.use(errors());
// обработчик кастомных ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
