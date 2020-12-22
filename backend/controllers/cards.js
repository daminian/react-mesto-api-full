const Card = require('../models/card');
const { ErrorRequest, ErrorNotFound, ErrorForbidden } = require('../errors/errors');

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
    throw new ErrorRequest('Введены неверные данные');
  }
  Card.create({ link, name, owner: req.user._id })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorRequest('Введены неверные данные'));
      }

      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if ((card.owner._id.toString() || card.onwer.toString()) !== req.user._id) {
        throw new ErrorForbidden('Недостаточно прав');
      } if (!card) {
        throw new ErrorNotFound('Карточска не найдена');
      }
      return Card.findByIdAndRemove(req.params.id)
        .then((responce) => {
          if (responce.deleteCount !== 0) {
            res.send({ data: card });
          }
        });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrorNotFound('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('owner')
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Карточка не найдена');
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      next(err);
    });
};
