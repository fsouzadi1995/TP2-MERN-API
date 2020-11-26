const jwt = require('jsonwebtoken');
var historical = require('../historicoQRController');

async function CreateToken(qr) {
  let result = null;
  const secret = historical.GetLatestSecret();
  try {
    const token = jwt.sign(qr._id.toJSON(), secret);
    result = {
      token: token,
    };
  } catch (error) {
    console.log(error);
  }
  return result;
}

async function VerifyToken(jwt) {
  let isValid = false;

  const secret = await historical.GetLatestSecret();

  jwt.verify(jwt, secret, function (error) {
    if (!error) isValid = true;
  });

  return isValid;
}

module.exports = {
  CreateToken,
  VerifyToken,
};
