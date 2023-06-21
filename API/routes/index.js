var express = require('express');
var router = express.Router();
var Mapa = require('../controllers/mapa')
var Related = require('../controllers/relations')
var Comentario = require('../controllers/comentarios')
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

router.get('/api/ruas/comentarios/:idRua',function(req, res, next) {
  Comentario.getComments(req.params.idRua).then(comentarios => {
    console.log("comentarios")
    console.log(comentarios)
    res.jsonp(comentarios);
  })
.catch(erro => {
    console.log(erro)
})
});

router.post('/api/ruas/comentarios',function(req, res, next) {
  console.log("Fez um post de um comentário!")
  console.log(req.body)
  Comentario.addComment(req.body).then(ok => {
    res.jsonp(ok);
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
      Related.deleteRuaRelacionados(req.params.id)
      .then(delok =>{
          Related.deleteRelated(req.params.id)
          .then(relok =>{
              res.jsonp(relok)
          }).catch(erro => {
            console.log(erro)
          })
      }).catch(erro => {
        console.log(erro)
      })
    }).catch(erro => {
      console.log(erro)
    })
});

module.exports = router;
