var express = require('express');
var router = express.Router();

var users = require('../controllers/usuariosController');

router.get('/', async (req, res) => {
  res.send(await users.Get());
});

router.get('/:param', async (req, res) => {
  let result = null
  if (req.params.param.includes('@')) {
    result = await users.GetByEmail(req.params.param)
  }
  else {
    result = await users.GetById(req.params.param);
    if (result == null) {
      result = await users.GetByInstitucionId(req.params.param)
    }
  }

  if (result !== null) res.status(200).json(result);
  else res.sendStatus(403);
});

//modificar update y create
router.post('/', async (req, res) => {
  const result = await users.Create(req.body);
  if (result !== null) res.status(201).json(result);
  else res.sendStatus(403);
});

router.put('/:id', async (req, res) => {
  const result = await users.Update(req.params.id, req.body);
  if (result !== null) res.status(200).json(result);
  else res.sendStatus(403);
});

router.delete('/:id', async (req, res) => {
  const result = await users.Delete(req.params.id, req.body);
  if (result !== null) res.sendStatus(200);
  else res.sendStatus(403);
});

module.exports = router;
