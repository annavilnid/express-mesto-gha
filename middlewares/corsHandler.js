const allowedCors = [
  'https://mesto.project.backend.nomoredomains.sbs',
  'http://mesto.project.backend.nomoredomains.sbs',
  'localhost:3000',
];

const corsHandler = (req, res, next) => {
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE'; // по умолчанию (разрешены все типы запросов)
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную method
  const requestHeaders = req.headers['access-control-request-headers']; // сохраняем список заголовков исходного запроса requestHeaders

  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin); // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Credentials', true); // разрешаем запросы с учётными данными
  }

  if (method === 'OPTIONS') { // Если это предварительный запрос, добавляем нужные заголовки
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS); // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Headers', requestHeaders); // разрешаем кросс-доменные запросы с заголовками из запроса и возвращаем результат клиенту
    res.end(); // завершаем обработку запроса
    return; // возвращаем результат
  }

  next();
};

module.exports = { corsHandler };
