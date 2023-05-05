const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user;
        })
        .then(() => {
          const token = jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: '7d' },
          );
          res.status(STATUS_OK).send({ message: 'Успешный вход', token });
        })
        .catch((err) => {
          if (err.statusCode === 401) {
            next(new AuthError('Неправильные почта или пароль'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        next(new AuthError('Неправильные почта или пароль'));
      } else {
        next(err);
      }
    });
};