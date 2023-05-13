var express = require('express');
var router = express.Router();
var Mapa = require('../controllers/mapa')
var Related = require('../controllers/relations')

router.get('/api/ruas', function(req, res, next) {
  Mapa.list()
    .then(mapa => {
      res.jsonp(mapa)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de ruas."})
    })
});

router.get('/api/ruas/:idRua',function(req, res, next) {
  Mapa.getRua(req.params.idRua).then(rua => {
          res.jsonp(rua);
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na obtenção da rua."})
    })
  
});

router.get('/api/ruas/related/:idRua',function(req, res, next) {
        Related.getRelatedStreets(req.params.idRua).then(related => {
          res.jsonp(related);
        })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro na obtenção da rua."})
  })
});

router.post('/api/addrua/', function(req, res, next) {
  Mapa.addRua(req.body).then(dados =>{
    console.log("Rua adicionado com sucesso :" + dados)
    res.redirect("/");
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro a adicionar nova rua."})
  })
});

router.get('/api/delete/:id', function(req, res, next) {
  Mapa.deleteRua(req.params.id)
  res.redirect("/");
});

module.exports = router;
