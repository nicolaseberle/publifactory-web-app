'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config').backend

module.exports = function checkToken(req, res, next) {
  const unparsedToken = req.body.token || req.params.token || req.headers['authorization'];
  if (unparsedToken) {
    const regExp = /Bearer (.*?)$/;
    const token = regExp.exec(unparsedToken)[1]
    jwt.verify(token, config.secrets.session, function (err, decoded) {
      if (err)
        return err.name === 'TokenExpiredError' ?
          res.status(403).json({ success: false, message: 'Token expired.' }) :
          res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
      else {
        req.decoded = decoded;
        next();
      }
    });
  } else
    return res.status(403).send({ success: false, message: 'No token provided.' })
}
