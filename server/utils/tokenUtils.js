const jwt = require('jsonwebtoken');
const secretKey = 'secret-key';

exports.generateToken = (user, rememberMe) => {
  const tokenPayload = { id: user.id, username: user.following_userid };
  const tokenOptions = rememberMe ? { expiresIn: '7d' } : { expiresIn: '1h' };
  return jwt.sign(tokenPayload, secretKey, tokenOptions);
};
