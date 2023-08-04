const { User } = require('../models');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

const authentication = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'invalid signature' || error.message === 'jwt malformed') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }

    return;
  }
}

module.exports = authentication;