const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../entities/usuario');
// const users = require('../usuariosController');
// const historical = require('../historicoQRController');

function GenerateToken(id, secret) {
  let result = null;
  try {
    result = jwt.sign(id.toJSON(), secret);
  } catch (error) {
    console.log(error);
  }
  return result;
}

async function VerifyQRToken(token) {
  const secret = await historical.GetLatestSecret();
  let isValid = false;

  jwt.verify(token, secret, function (error) {
    if (!error) isValid = true;
  });

  return isValid;
}

async function RemoveSensitive(data) {
  let newObj = Object.assign({}, data);

  delete newObj.secret;
  newObj._jwt = GenerateToken(newObj._id, data.secret);

  console.log(newObj);

  return newObj;
}

module.exports = {
  VerifyQRToken,
  RemoveSensitive,
};
