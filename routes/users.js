const userRouter = require('express').Router();
// const { errors } = require('celebrate');
const { joiErrorsUpdateUserInfo, joiErrorsUpdateUserAvatar, joiErrorsGetUserId } = require('../errors/joiErrors');

const {
  //   createUser,
  getUsers,
  getUserId,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:userId', joiErrorsGetUserId, getUserId);
// userRouter.post('/', createUser);
userRouter.patch('/me', joiErrorsUpdateUserInfo, updateUserInfo);
userRouter.patch('/me/avatar', joiErrorsUpdateUserAvatar, updateUserAvatar);

module.exports = userRouter;
