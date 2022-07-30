const router = require('express').Router();
const {
  getUsers, getUser, getUsersById, updateProfile, updateAvatar,
} = require('../controllers/users');
const { validateUserId } = require('../middlewares/validator');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', validateUserId, getUsersById);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
