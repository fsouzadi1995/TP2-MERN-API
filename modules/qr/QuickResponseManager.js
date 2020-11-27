const historical = require('../../controllers/historicoQRController');
const { setIntervalAsync } = require('set-interval-async/dynamic');

async function Initialize() {
  setIntervalAsync(async () => {
    let result = await Generate();

    if (result !== null)
      console.log(new Date() + ' - NEW QR Code generated: ' + result.secret);
    else console.log('>>> Error: Issue generating QR');
  }, 15 * 60000);
}

/**
 * Generates a new QR code with a randomly generated secret
 */
async function Generate() {
  return await historical.Create();
}

module.exports = { Initialize, Generate };
