var express = require('express');
var router = express.Router();
var env = require('../config/env')
var axios = require('axios')
var jwt = require('jsonwebtoken')
var filesystem = require('fs')

var multer = require('multer')
var upload = multer({dest: 'uploads'})
var current_user = null;

function verificaToken(req, res, next) {
  if(req.cookies && req.cookies.token && req.cookies.token!="revogado.revogado.revogado") next()
  else {
    res.redirect("/")
  }
}

/* GET home page. */
router.get('/', function(req, res){
  if(req.cookies && req.cookies.token) {
    jwt.verify(req.cookies.token, "EngWeb2023", function(e, payload){
      console.log(payload)
      if(e){
        res.render('login')
      }
      else{
        current_user=payload
        axios.get(env.apiAccessPoint+"/ruas"+"?token=" + req.cookies.token)
        .then(mapa =>(
            res.render('lista', { streets: mapa.data,user: payload})
        )).catch(err => (
            res.render('error',{error: err})
        ))
      
      }
    })
  }
  else res.render('login')
})

/* GET home page. */
router.get('/ruas',verificaToken,function(req, res, next) {
    axios.get(env.apiAccessPoint+"/ruas"+"?token=" + req.cookies.token)
        .then(mapa =>(
          axios.get(env.apiAccessPoint+"/ruas"+"?token=" + req.cookies.token)
          .then(mapa =>(
              res.render('lista', { streets: mapa.data,user: current_user})
          )).catch(err => (
              res.render('error',{error: err})
          ))
          )).catch(err => (
            res.render('error',{error: err})
    ))
     
});

/* GET street page. */
router.get('/ruas/:idRua',verificaToken , function(req, res, next) {
  console.log(current_user)
  axios.get(env.apiAccessPoint+"/ruas/"+req.params.idRua)
  .then(rua =>(
      axios.get(env.apiAccessPoint+"/ruas/related/"+req.params.idRua+ "?token=" + req.cookies.token)
      .then(related =>(
          res.render('rua', { street: rua.data, relacionados: related.data,user: current_user})
      )).catch(err => (
          res.render('error',{error: err})
      ))
  )).catch(err => (
      res.render('error',{error: err})
  ))
});


router.get('/delete/:idRua',verificaToken , function(req, res, next) {
    axios.delete(env.apiAccessPoint+"/delete/"+req.params.idRua)
    .then(ok =>{
        res.redirect('/ruas')
    }).catch(err => (
      res.render('error',{error: err})
  ))
});

router.get('/add',verificaToken , function(req, res, next) {
  res.render('add')
});

router.post('/add',verificaToken ,upload.single('figura'), function(req, res, next) {
  console.log(req.file.originalname)
  let oldPath = __dirname + '/../'+ req.file.path
  let newPath = __dirname + '/../public/images/dados/materialBase/atual/'+req.file.originalname
  
  filesystem.rename(oldPath,newPath,erro =>{
    if(erro){
      console.log("erro")
    }
  })
  axios.post(env.apiAccessPoint + "/addrua",req.body)
  .then(response => {
    res.render('add') //adicionar arg extra a informar de que correu bem
  }).catch(err => {
    res.render('error', {error: err})
  })
});

router.post("/", (req, res) => {
  console.log(req.body)
  axios.post(env.authAccessPoint + "/login", req.body)
    .then(response => {
      res.cookie("token", response.data.token)
      res.redirect('/ruas')
    })
    .catch(err => {
      let msg = "Dados incorretos, efetue novamente o login."
      res.render('login', {message: msg })
    })
})


router.get("/logout", verificaToken, (req,res) => {
  res.cookie('token', "revogado.revogado.revogado")
  res.cookie.token="revogado.revogado.revogado"
  current_user = null
  res.redirect('/')
})

router.get("/login",verificaToken, function(req,res) {
  res.render("login")
})

router.get("/register", function(req,res) {
  res.render("register")
})

router.post("/register",upload.single('myphoto'), (req, res) => {
  let oldPath = __dirname + '\\..\\'+ req.file.path
  let newPath = __dirname + '\\..\\public\\images\\imagensdeperfil\\'+req.file.originalname

  filesystem.rename(oldPath,newPath,erro =>{
    if(erro){
      console.log("erro")
    }
  })
  req.body['myphoto']=req.file.originalname
  axios.post(env.authAccessPoint + "/register?token=" + req.cookies.token, req.body)
    .then(response => {
      res.redirect('/')
    })
    .catch(err => {
      res.render('error', {error: err})
    })
})


module.exports = router;
