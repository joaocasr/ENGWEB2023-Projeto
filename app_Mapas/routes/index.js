var express = require('express');
var router = express.Router();
var Mapa = require('../controllers/mapa')

/* GET home page. */
router.get('/', function(req, res, next) {
  Mapa.list()
  .then(dados=> res.status(200).json(dados))
  .catch(erro =>res.status(520).json({erro:erro,mesagem:"erro na obtençao de lista"}))
});

module.exports = router;
