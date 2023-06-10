var express = require('express');
var router = express.Router();
var Mapa = require('../controllers/mapa')
var Related = require('../controllers/relations')
var relatedpara  = require('../public/javascripts/para')

router.get('/api/ruas', function(req, res, next) {
  Mapa.list()
    .then(mapa => {
      res.jsonp(mapa)
    })
    .catch(erro => {
      console.log(erro)
    })
});

router.get('/api/ruas/:idRua',function(req, res, next) {
  Mapa.getRua(req.params.idRua).then(rua => {
          res.jsonp(rua);
        })
        .catch(erro => {
          console.log(erro)
    })
  
});

router.get('/api/ruas/related/:idRua',function(req, res, next) {
  Related.getRelatedStreets(req.params.idRua).then(related => {
    res.jsonp(related);
  })
.catch(erro => {
    console.log(erro)
})
});


router.post('/api/addrua', function(req, res, next) {
  Mapa.addRua(req.body).then(rua =>{
    console.log("Rua adicionado com sucesso :" + rua)
      relatedpara.getStreetspara(rua).then(relacionadas =>{
        Related.addRelatedStreets(relacionadas).then(ok =>{
          res.jsonp(ok)
        }).catch(erro => {
          console.log(erro)
        })
      })
      .catch(erro => {
        console.log(erro)
      })
  })
  .catch(erro => {
    console.log(erro)
  })
});

router.delete('/api/delete/:id', function(req, res, next) {
    Mapa.deleteRua(req.params.id).then(ok =>{
      res.jsonp(ok)
    }).catch(erro => {
      console.log(erro)
    })
});

module.exports = router;
