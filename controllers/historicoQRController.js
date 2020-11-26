const mongoose = require('mongoose');
const HistoricalQR = require('../entities/historicoQR');
const Util = require('./util/controller-util');
const tokenUtil = require('./util/token-util');

const loader = require('../infrastructure/config-loader');
const btoa = require('btoa');

/**
 * Returns an array of HistoricalQRs
 */
async function Get() {
  try {
    const HistoricalQR = await getDB();
    return await HistoricalQR.find({});
  } catch (err) {}
}

/**
 * Returns the latest HistoricalQR generated
 */
async function GetLatest() {
  try {
    const HistoricalQR = await getDB();
    const latestQR = await HistoricalQR.findOne().sort({ _id: -1 });
    const token = await tokenUtil.CreateToken(latestQR);

    const QR = {
      _id: latestQR._id,
      token: token.token,
      created: latestQR.created,
      expire: latestQR.expire,
    };

    return QR;
  } catch (err) {}
}
/**
 * Returns the latest HistoricalQR secret generated
 */
async function GetLatestSecret() {
  const HistoricalQR = await getDB();
  let result = null;
  try {
    result = await HistoricalQR.findOne().sort({ _id: -1 });
  } catch (err) {}

  return result.secret;
}
/**
 * Returns a HistoricalQR that matches the id
 * @param number {} id
 */
async function GetById(id) {
  const HistoricalQR = await getDB();
  let result = null;

  try {
    if (Util.IsObjectId(id)) result = await HistoricalQR.findById(id);
    else throw `>>> Error: id cannot be casted to ObjectId`;
  } catch (err) {
    console.log(err);
  }

  return result;
}

/**
 * Creates a new HistoricalQR
 */

async function Create() {
  const HistoricalQR = await getDB();
  let result = null;

  const date = new Date();
  const expireTime = 15;

  try {
    result = await new HistoricalQR({
      secret: btoa(
        btoa(date.valueOf()) +
          Math.random() * 555 +
          date.valueOf().toString().substr(0, 5).split('').reverse().join('')
      ),
      created: date.valueOf(),
      expire: new Date(date.getTime() + expireTime * 60000).valueOf(),
    }).save();
  } catch (err) {
    console.log(err);
  }

  return result;
}

async function getDB() {
  return await global.clientConnection
    .useDb('historicoQR')
    .model('HistoricalQR');
}

module.exports = {
  Get,
  GetLatest,
  GetById,
  Create,
  GetLatestSecret,
};
