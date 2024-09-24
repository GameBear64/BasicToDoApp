const jwt = require('jsonwebtoken');
const { wildcardMatch, pick } = require('../toolbox/utils');
const { noAuthRoutes } = require('../toolbox/consts');
const db = require('../data/db-config');

exports.checkAuth = async (req, res, next) => {
  let isNoAuthRoute = noAuthRoutes.some(
    route => wildcardMatch(route.path, req.path) && route.methods.includes(req.method)
  );
  if (isNoAuthRoute) return next();

  try {
    let decoded = jwt.verify(req.cookies?.jwt, process.env.SECRET);

    let currentUser = await db('users').where('id', decoded.id).first();
    if (!currentUser) throw new Error('The user belonging to this token no longer exist.');

    if (currentUser?.passwordChangedAt) {
      let lastChanged = currentUser.passwordChangedAt.getTime() / 1000;
      if (decoded.iat < lastChanged) throw new Error('User changed password, please log in again.');
    }

    req.authUser = pick(currentUser, ['id']);

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return res.status(401).json('Not Authorized');

    return res.status(401).json(err.message);
  }
};
