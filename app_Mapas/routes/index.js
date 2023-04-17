var express = require('express');
var fs = require('fs')
var router = express.Router();
var Mapa = require('../controllers/mapa')
var Related = require('../controllers/relations')


/* GET home page. */
router.get('/', function(req, res, next) {
  Mapa.list()
    .then(mapa => {
      res.render('index', { streets: mapa});
      //res.status(200).json(mapas)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de ruas."})
    })
    /* .then(dados=> res.status(200).json(dados))
    .catch(erro =>res.status(520).json({erro:erro,mesagem:"erro na obtençao de lista"})) */
});

router.get('/ruas/:idRua', function(req, res, next) {
  Mapa.getRua(req.params.idRua).then(rua => {
          Related.getRelatedStreets(rua._id).then(related => {
          console.log(related);
          res.render('rua', { street: rua, relacionados: related});
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na obtenção das ruas relacionadas."})
        })
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro na obtenção da rua."})
  })
});

module.exports = router;
