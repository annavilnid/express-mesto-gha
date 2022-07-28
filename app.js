const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { NOT_FOUND_CODE } = require('./errors/errors');
const { auth } = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая страница или URL не найдены' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту`);
});
