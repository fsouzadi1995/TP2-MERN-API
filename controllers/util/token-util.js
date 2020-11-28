const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const User = require('../../entities/usuario');
// const historical = require('../historicoQRController');
// const users = require('../usuariosController');

function GenerateToken(id, secret) {
  let result = null;
  try {
    result = jwt.sign(id.toJSON(), secret);
  } catch (error) {
    console.log(error);
  }
  return result;
}

async function VerifyQRToken(token, secret) {
  let isValid = false;

  console.log('qr token:', token);
  console.log('secret:', secret);

  jwt.verify(token, secret, function (err) {
    if (!err) isValid = true;
  });

  return isValid;
}

function RemoveSensitive(data) {
  let newObj = Object.assign({}, data);

  delete newObj.secret;
  newObj._jwt = GenerateToken(newObj._id, data.secret);

  return newObj;
}

module.exports = {
  VerifyQRToken,
  RemoveSensitive,
};
