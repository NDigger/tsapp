const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 200 — всё прошло успешно.
// 400 — ошибка со стороны клиента (неверный запрос, нет нужных данных и т.п.).
// 401 — не авторизован.
// 403 — запрещено (доступ есть, но нельзя).
// 404 — не найдено.
// 500 — ошибка на сервере.

// app.use(cors({
//   origin: 'http://localhost:5173',
//   optionsSuccessStatus: 200,
//   credentials: true
// }));
app.use(cookieParser(process.env.SECRET));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', async (req, res) => {
  res.send('Welcome to the backend');
});
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/user', require('./routes/user'))
app.use('/api/location', require('./routes/location'))
app.use('/api/items', require('./routes/items'))
app.use('/api/seller', require('./routes/seller'))
app.use('/api/cart', require('./routes/cart'))
app.use('/api/order', require('./routes/order'))

module.exports = app