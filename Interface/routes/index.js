var express = require('express');
var router = express.Router();
var env = require('../config/env')
var axios = require('axios')
var jwt = require('jsonwebtoken')
var filesystem = require('fs')
const path = require('path');

var multer = require('multer')
var upload = multer({dest: 'uploads'})
var current_user = null;
var current_dir = null;

function verificaToken(req, res, next) {
  if(req.cookies && req.cookies.token 
    && req.cookies.token!="revogado.revogado.revogado" && current_user!=null) 
    next()
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
            res.render('lista', { streets: mapa.data,user: current_user})
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
    console.log(current_user)
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

router.post('/add',verificaToken ,upload.fields([{ name: 'antigas', maxCount: 10 }, { name: 'atuais', maxCount: 10 }]), function(req, res, next) {
  console.log("***DEBUG IMAGENS")
  console.log(req.files)
  console.log(req.body)
  req.body.figura=[]
  req.body.figurasAtuais=[]

  for (let i = 0; i < req.files.antigas.length; i++) {
    console.log(req.files.antigas[i].originalname)
    let oldPath = path.resolve(__dirname, '..', req.files.antigas[i].path);
    let newPath = path.resolve(__dirname, '..', 'public', 'images','dados', 'materialBase','imagem', req.files.antigas[i].originalname);
    filesystem.rename(oldPath,newPath,erro =>{
      if(erro){
        console.log("erro")
      }
    })
    
    req.body.figura[i]={
        "legenda": req.files.antigas[i].originalname,
        "path": "imagem/"+req.files.antigas[i].originalname,
        "id": req.files.antigas[i].originalname
    }    
  } 

  for (let i = 0; i < req.files.atuais.length; i++) {
    console.log(req.files.atuais[i].originalname)

    let oldPath = path.resolve(__dirname, '..', req.files.atuais[i].path);
    let newPath = path.resolve(__dirname, '..', 'public', 'images','dados', 'materialBase','atual', req.files.atuais[i].originalname);
    filesystem.rename(oldPath,newPath,erro =>{
      if(erro){
        console.log("erro")
      }
    })
    
    req.body.figurasAtuais[i]={
    "nome": req.files.atuais[i].originalname
    }
  } 
  console.log("HERE IT ISSS")
  console.log(req.body)
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

router.get("/register",verificaToken,function(req,res) {
  res.render("register")
})

router.get("/creditos", function(req,res) {
  res.render("creditos")
})

router.post("/register",upload.single('myphoto'), (req, res) => {
  let oldPath = path.resolve(__dirname, '..', req.file.path);
  let newPath = path.resolve(__dirname, '..', 'public', 'images', 'imagensdeperfil', req.file.originalname);
  filesystem.rename(oldPath,newPath,erro =>{
    if(erro){
      console.log("erro:"+erro+"\nNew Path:"+newPath+"\nOld Path:"+oldPath)
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
