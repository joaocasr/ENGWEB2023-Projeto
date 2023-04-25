var express = require('express');
var fs = require('fs')
var router = express.Router();
var passport = require('passport')
var Mapa = require('../controllers/mapa')
var Related = require('../controllers/relations')


function verificaAutenticacao(req, res, next){
  console.log('User (verif.): ' + JSON.stringify(req.user))
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
    res.redirect("/");
  }
}


router.get('/', function(req, res) {
  res.render('login')
})
  
router.post('/', passport.authenticate('local'), function(req, res) {
 	res.redirect('/ruas')
})

router.get('/logout', function(req, res) {
  req.logout(function(err){
    if(err){
      console.log("LOGOUT ERROR"+err)
      res.render('error',{error:err})
    }else{
      res.redirect('/')
    }
  })
})

//Register
router.get('/register',function(req,res){
  res.render('register')
})

var userModel= require('../models/users')
router.post('/register',function(req,res){
  var d = new Date().toISOString().substring(0,16)
  userModel.register(new userModel({
    username:req.body.username,
    email:req.body.email,
    name:req.body.name,
    dateCreated:d,
    role:req.body.role,
    active:true
  }),req.body.password,function(err,user){
    if(err){
      console.log("register error "+err)
      res.render('error',{error:err})
    }else{
      res.redirect('/')
    }
  })
})

/* GET home page. */
router.get('/ruas', function(req, res, next) {
  if(req.isAuthenticated()){
  Mapa.list()
    .then(mapa => {
      res.render('index', { streets: mapa, user: req.user});
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção da lista de ruas."})
    })
  }else{
    res.render('error', {error:"Área restrita" ,message: "<p>Para aceder ao conteúdo da plataforma 'Braga Street View', efetue o <a href=\"/\">login</a>.</p><p>Se ainda não possui uma conta registe-se <a href=\"/register\">aqui.</a></p>"})
  }
});

router.get('/ruas/:idRua', verificaAutenticacao ,function(req, res, next) {
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

router.get('/addrua/', function(req, res, next) {
      res.render('add', {});
});

router.post('/addrua/', function(req, res, next) {
  Mapa.addRua(req.body).then(dados =>{
    console.log("Rua adicionado com sucesso :" + dados)
    res.redirect("/");
  })
  .catch(erro => {
    res.render('error', {error: erro, message: "Erro a adicionar nova rua."})
  })
});

router.get('/delete/:id', function(req, res, next) {
  Mapa.deleteRua(req.params.id)
  res.redirect("/");
});

module.exports = router;
