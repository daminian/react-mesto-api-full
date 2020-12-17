const router = require('express').Router();
const {
  findUser, findByIdUser, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/users', findUser);

router.get('/users/me', getUserInfo);

router.get('/users/:_id', findByIdUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
