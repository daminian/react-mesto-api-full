const Card = require('../models/card');
const { ErrorReq, ErrorNotFound } = require('../errors/errors');

module.exports.findCard = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.creatCard = (req, res, next) => {
  const { link, name } = req.body;
  if (!name || !link) {
    throw new ErrorReq('Введены неверные данные');
  }
  Card.create({ link, name, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch(next);
};
