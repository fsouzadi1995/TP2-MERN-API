let express = require('express');
let router = express.Router();
const jwt = require('jsonwebtoken');

var tokens = require('../controllers/tokensController');

router.post('/', async function (req, res) {

    const qr = {
        _id: req.headers['qr'],
        secret: req.headers['qr_secret'],
      };

    const result = await tokens.CreateToken(qr);
    if (result !== null) res.status(201).json(result);
    else res.sendStatus(403);
});

module.exports = router;