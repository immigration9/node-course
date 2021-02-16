const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');
const NotFoundError = require('../errors/NotFound');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token =
      req.header('Authorization') &&
      req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      throw new JsonWebTokenError();
    }

    const decoded = jwt.verify(token, 'jwt_secret');

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new NotFoundError();
    }

    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};

module.exports = auth;
