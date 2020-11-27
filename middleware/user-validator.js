const jwt = require('jsonwebtoken');
const users = require('../controllers/usuariosController');

async function userValidator(req, res, next) {
  console.log(req);
  const token = req.body['_jwt'];

  console.log('token:', token);

  if (!token) {
    return res.status(401).json({
      auth: false,
      errorMessage: 'No token provided',
    });
  } else {
    jwt.verify(
      token,
      await users.GetSecretById(req.body[_id]),
      function (error) {
        if (error) {
          res.status(401).json({
            auth: false,
            errorMessage: 'Invalid token',
          });
        } else next();
      }
    );
  }
}

module.exports = userValidator;
