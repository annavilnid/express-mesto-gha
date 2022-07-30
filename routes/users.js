const router = require('express').Router();
const {
  getUsers, getUser, getUsersById, updateProfile, updateAvatar,
} = require('../controllers/users');
const { validateUserId, validateUpdateUser, validateUpdateAvatar } = require('../middlewares/validator');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', validateUserId, getUsersById);

router.patch('/me', validateUpdateUser, updateProfile);

router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = router;
