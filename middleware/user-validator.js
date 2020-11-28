var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const users = require('../controllers/usuariosController');

async function userValidator(req, res, next) {
  const token = req.body['_jwt'];
  const secret = await users.GetSecretById(req.body['userId']);

  if (!token) {
    return res.status(401).json({
      auth: false,
      errorMessage: 'No token provided',
    });
  } else {
    jwt.verify(token, secret, (err) => {
      if (err) {
        res.status(401).json({
          auth: false,
          errorMessage: 'Invalid token',
        });
      } else next();
    });
  }
}

module.exports = userValidator;
