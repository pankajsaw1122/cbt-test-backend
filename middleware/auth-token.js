const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader;
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'weareworkingoncbttestapplication');
  } catch (err) {
    err.statusCode = 401;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  // console.log('print userId = ' + decodedToken.userId);
  next();
};