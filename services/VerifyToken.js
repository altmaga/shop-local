const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const verifyToken = (req, res, next) => {

  // check header or url parameters or post parameters for token
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      auth: false,
      msg: 'No token provided.'
    });
  }
  else {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          auth: false,
          msg: 'Failed to authenticate token.'
        });
      }
      else {
        // if everything is good, save to request for use in other routes
        req.userId = decoded.id;
        next();
      }
    });
  }
}

module.exports = verifyToken;