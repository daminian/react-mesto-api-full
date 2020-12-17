const jwt = require('jsonwebtoken');
const { ErrorAuth } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new ErrorAuth('Необходима авторизация');
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    req.user = payload;
  } catch (err) {
    throw new ErrorAuth('Необходима авторизация');
  }

  return next();
};
