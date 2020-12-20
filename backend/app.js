require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 3001;
const app = express();
const { errors } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');
const { validateRegistration, validateLogin } = require('./utils/validate');
const errorServer = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const hosts = [
  'https://localhost:3001',
  'http://localhost:3001',
  'https://localhost:3000',
  'http://localhost:3000',
  'https://www.daminian.students.nomoreparties.space',
  'http://www.daminian.students.nomoreparties.space',
  'https://daminian.students.nomoreparties.space',
  'http://daminian.students.nomoreparties.space',
];
app.use(cors({ origin: hosts }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegistration, createUser);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);

app.use(errorLogger);
app.use(errors());

app.use(errorServer);

app.listen(PORT);
