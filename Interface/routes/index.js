var express = require('express');
var router = express.Router();
var env = require('../config/env')
var axios = require('axios')
var jwt = require('jsonwebtoken')


function verificaToken(req, res, next) {
  if(req.cookies && req.cookies.token) next()
  else {
    res.redirect("/login")
  }
}
router.get('/', function(req, res){
  if(req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, "EngWeb2023", function(e, payload){
      if(e){
        res.render('login')
      }
      else{
        res.render('login', {u: payload})
      }
    })
  }
  else res.render('login')
})


router.post("/", (req, res) => {
  axios.post(env.authAccessPoint + "/login", req.body)
    .then(response => {
      res.cookie("token", response.data.token)
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err})
    })
})


router.get("/logout", verificaToken, (req,res) => {
  res.cookie('token', "revogado.revogado.revogado")
  res.redirect('/')
})


router.get("/register", function(req,res) {
  console.log("get /register")
  res.render("register")
})

router.post("/register", function(req, res) {
  console.log("post /register")
  axios.post(env.authAccessPoint + "/register", req.body)
    .then(response => {
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err,message:err})
    })
})

/* GET home page. */
router.get('/ruas',verificaToken,function(req, res, next) {
  if(req.isAuthenticated()){
  axios.get(env.apiAcessPoint+"/ruas"+"?token=" + req.cookies.token)
  .then(mapa =>(
      res.render('index', { streets: mapa.data,user: req.user})
  )).catch(err => (
      res.render('error',{error: err})
  ))
  }else{
    res.render('error', {error:"Área restrita" ,message: "<p>Para aceder ao conteúdo da plataforma 'Braga Street View', efetue o <a href=\"/\">login</a>.</p><p>Se ainda não possui uma conta registe-se <a href=\"/register\">aqui.</a></p>"})
  }
});

router.get('/ruas/:idRua',verificaToken , function(req, res, next) {
  if(req.isAuthenticated()){
  axios.get(env.apiAcessPoint+"/ruas/"+req.params.idRua)
  .then(rua =>(
      axios.get(env.apiAcessPoint+"/ruas/related/"+req.params.idRua)
      .then(related =>(
          res.render('rua', { street: rua.data, relacionados: related.data,user:req.user})
      )).catch(err => (
          res.render('error',{error: err})
      ))
  )).catch(err => (
      res.render('error',{error: err})
  ))
  }
});

router.get('/addRua/', function(req, res, next) {
  res.render('add')
});


module.exports = router;
