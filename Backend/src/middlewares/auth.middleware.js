const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwt-secret');

function requireAuth(req, res, next) {
  let secret;
  try {
    secret = getJwtSecret();
  } catch (error) {
    return next(error);
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = requireAuth;
