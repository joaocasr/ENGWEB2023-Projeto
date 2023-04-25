var express = require('express');
var fs = require('fs')
var router = express.Router();
var passport = require('passport')
var Mapa = require('../controllers/mapa')
var Related = require('../controllers/relations')
var multer = require('multer')
var upload = multer({dest: 'uploads'})

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

//Register
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
