const userRouter = require('express').Router();
// const { errors } = require('celebrate');
const { joiErrorsUpdateUserInfo, joiErrorsUpdateUserAvatar } = require('../errors/joiErrors');

const {
  //   createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserId);
// userRouter.post('/', createUser);
userRouter.patch('/me', joiErrorsUpdateUserInfo, updateUserInfo);
userRouter.patch('/me/avatar', joiErrorsUpdateUserAvatar, updateUserAvatar);
userRouter.get('/me', getUserInfo);

module.exports = userRouter;
