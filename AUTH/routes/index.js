var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var passport = require('passport')
var userModel = require('../models/user')
var auth = require('../auth/auth')

var User = require('../controllers/user')

router.get('/users', auth.verificaAcesso, function(req, res){
  User.list()
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.get('/users/:id', auth.verificaAcesso, function(req, res){
  User.getUser(req.params.id)
    .then(dados => res.status(200).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/users', auth.verificaAcesso, function(req, res){
  User.addUser(req.body)
    .then(dados => res.status(201).jsonp({dados: dados}))
    .catch(e => res.status(500).jsonp({error: e}))
})

router.post('/users/register', auth.verificaAcesso, function(req, res) {
  var d = new Date().toISOString().substring(0,19)
  console.log(req.body)
  userModel.register(new userModel({ username: req.body.username, name: req.body.name, email: req.body.email,
                                      role: req.body.role, active: true,myphoto: req.body.myphoto, dateCreated: d }), 
                req.body.password, 
                function(err, user) {
                  if (err) 
                    res.jsonp({error: err, message: "Register error: " + err})
                  else{
                    passport.authenticate("local")(req,res,function(){
                      jwt.sign({ username: req.user.username, role: req.user.role,name:req.user.name, myphoto:req.user.myphoto,
                        sub: 'aula de EngWeb2023'}, 
                        "EngWeb2023",
                        {expiresIn: 3600},
                        function(e, token) {
                          if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
                          else res.status(201).jsonp({token: token})
                        });
                    })
                  }     
  })
})

router.post('/users/login', passport.authenticate('local'), function(req, res){
  console.log(req.user)
  jwt.sign({ username: req.user.username, role: req.user.role, name:req.user.name, myphoto:req.user.myphoto,
    sub: 'aula de EngWeb2023'}, 
    "EngWeb2023",
    {expiresIn: 3600},
    function(e, token) {
      if(e) res.status(500).jsonp({error: "Erro na geração do token: " + e}) 
      else res.status(201).jsonp({token: token})
});
})

router.put('/users/:id', auth.verificaAcesso, function(req, res) {
  User.updateUser(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/users/:id/desativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, false)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/users/:id/ativar', auth.verificaAcesso, function(req, res) {
  User.updateUserStatus(req.params.id, true)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.put('/users/:id/password', auth.verificaAcesso, function(req, res) {
  User.updateUserPassword(req.params.id, req.body)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na alteração do utilizador"})
    })
})

router.delete('/users/:id', auth.verificaAcesso, function(req, res) {
  User.deleteUser(req.params.id)
    .then(dados => {
      res.jsonp(dados)
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na remoção do utilizador"})
    })
})

module.exports = router;