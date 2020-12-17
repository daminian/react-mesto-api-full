const router = require('express').Router();
const {
  findCard, creatCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', findCard);

router.post('/cards', creatCard);

router.delete('/cards/:id', deleteCard);

router.put('/cards/:id/likes', likeCard);

router.delete('/cards/:id/likes', dislikeCard);

module.exports = router;
