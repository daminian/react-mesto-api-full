const router = require('express').Router();
const {
  findCard, creatCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const { validateId, validateCreateCard } = require('../utils/validate');

router.get('/cards', findCard);

router.post('/cards', validateCreateCard, creatCard); // joi

router.delete('/cards/:id', validateId, deleteCard);

router.put('/cards/:id/likes', validateId, likeCard);

router.delete('/cards/:id/likes', validateId, dislikeCard);

module.exports = router;
