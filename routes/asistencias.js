var express = require('express');
var router = express.Router();

const userValidator = require('../middleware/user-validator');

const attendances = require('../controllers/asistenciasController');
const tokenUtil = require('../controllers/util/token-util');
const historical = require('../controllers/historicoQRController');

router.get('/', async (req, res) => {
  res.send(await attendances.Get());
});

router.get('/:id', async (req, res) => {
  const result = await attendances.GetById(req.params.id);
  if (result !== null) res.json(result);
  else res.sendStatus(403);
});

router.get('/usuario/:id', async (req, res) => {
  const result = await attendances.GetByUserId(req.params.id);
  if (result !== null) res.json(result);
  else res.sendStatus(403);
});

router.get('/usuario/:id/latest', async (req, res) => {
  const result = await attendances.GetLatestByUserId(req.params.id);
  if (result !== null) res.json(result);
  else res.sendStatus(403);
});

router.post('/', userValidator, async (req, res) => {
  const isValid = await tokenUtil.VerifyQRToken(
    req.headers['jwt'],
    await historical.GetLatestSecret()
  );

  if (isValid) {
    const result = await attendances.Create(req.body);
    if (result !== null) res.status(201).json(result);
    else res.sendStatus(403);
  } else res.sendStatus(401);
});

router.put('/:id', userValidator, async (req, res) => {
  const isValid = await tokenUtil.VerifyQRToken(
    req.headers['jwt'],
    await historical.GetLatestSecret()
  );

  if (isValid) {
    const result = await attendances.Update(req.params.id, req.body);
    if (result !== null) res.status(200).json(result);
    else res.sendStatus(403);
  } else res.sendStatus(401);
});

router.delete('/:id', async (req, res) => {
  const result = await attendances.Delete(req.params.id, req.body);
  if (result !== null) res.sendStatus(200);
  else res.sendStatus(403);
});

module.exports = router;
