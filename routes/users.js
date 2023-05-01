const userRouter = require('express').Router();
const { joiErrorsUpdateUserInfo } = require('../errors/joiErrors');

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
userRouter.patch('/me/avatar', updateUserAvatar);
userRouter.get('/me', getUserInfo);

module.exports = userRouter;
