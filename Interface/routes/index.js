var express = require('express');
var router = express.Router();
var passport = require('passport')
var env = require('../config/env')
var fs = require('fs')
var axios = require('axios')
var multer = require('multer')
var upload = multer({dest: 'uploads'})

router.get('/', function(req, res) {
  res.render('login')
})

function verificaAutenticacao(req, res, next){
  console.log('User (verif.): ' + JSON.stringify(req.user))
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
    res.redirect("/");
  }
}

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      let msg = "Os dados que introduziu encontram-se incorretos, efetue novamente o login."
      res.render('login', {message: msg })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/ruas');
    });
  })(req, res, next);
});

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

router.get('/register',function(req,res){
  res.render('register')
})

var userModel= require('../models/users')
router.post('/register',upload.single('myphoto'),function(req,res){
  console.log('cdir: '+ __dirname)
  let oldPath = __dirname + '/../'+ req.file.path
  console.log('olddir: '+ oldPath)
  let newPath = __dirname + '/../public/profilepictures/'+req.file.originalname
  console.log("new path: "+newPath)
  
  fs.rename(oldPath,newPath,erro =>{
    if(erro){
      console.log("erro")
    }
  })
  var d = new Date().toISOString().substring(0,16)
  userModel.register(new userModel({
    username:req.body.username,
    email:req.body.email,
    name:req.body.name,
    profilepicture:req.file.originalname,
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
  axios.get(env.apiAcessPoint+"/ruas")
  .then(mapa =>(
      res.render('index', { streets: mapa.data,user: req.user})
  )).catch(err => (
      res.render('error',{error: err})
  ))
  }else{
    res.render('error', {error:"Área restrita" ,message: "<p>Para aceder ao conteúdo da plataforma 'Braga Street View', efetue o <a href=\"/\">login</a>.</p><p>Se ainda não possui uma conta registe-se <a href=\"/register\">aqui.</a></p>"})
  }
});

router.get('/ruas/:idRua',verificaAutenticacao , function(req, res, next) {
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
