const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const NOT_FOUND_CODE = 404;
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.use((req, res, next) => {
  req.user = {
    _id: '62cbc44213ecc8592021ee6c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next(res.status(NOT_FOUND_CODE).send({ message: 'Адреса по вашему запросу не существует' }));
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(require('./routes/users'));
app.use(require('./routes/cards'));
// app.use('/users', require('./routes/users'));

app.listen(PORT, () => {});
