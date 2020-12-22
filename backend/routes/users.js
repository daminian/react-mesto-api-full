const router = require('express').Router();
const {
  findUser, findByIdUser, updateProfile, updateAvatar, getUserInfo,
} = require('../controllers/users');

const { validateId, validateUpdateProfile, validateUpdateAvatar } = require('../utils/validate');

router.get('/users', findUser);

router.get('/users/me', getUserInfo);

router.get('/users/:_id', validateId, findByIdUser);

router.patch('/users/me', validateUpdateProfile, updateProfile);

router.patch('/users/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
