var express = require('express');
var router = express.Router();
var env = require('../config/env')
var axios = require('axios')
var jwt = require('jsonwebtoken')
var fs = require('fs')
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
        res.render('lista', { streets: mapa.data,user: current_user})
      )).catch(err => (
        res.render('error',{error: err})
    ))
});

/* GET street page. */
router.get('/ruas/:idRua',verificaToken , function(req, res, next) {
  console.log(current_user)
  axios.get(env.apiAccessPoint+"/ruas/"+req.params.idRua+"?token=" + req.cookies.token)
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
    axios.delete(env.apiAccessPoint+"/ruas/"+req.params.idRua)
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
  console.log(req.body)
  req.body.figura=[]
  req.body.figurasAtuais=[]

  if (req.files.antigas) {
    for(let i = 0; i < req.files.antigas.length; i++){
        let oldPath = path.resolve(__dirname, '..', req.files.antigas[i].path);
        let newPath = path.resolve(__dirname, '..', 'public', 'images','dados', 'materialBase','imagem', req.files.antigas[i].originalname);
  
        fs.rename(oldPath,newPath,erro =>{
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
  }else{
    req.body.figura[0]={
      "legenda": "placeholder.png",
      "path": "imagem/placeholder.png",
      "id": "placeholder.png"
    }
  }

  // Renaming and saving the path for atuais images
  if (req.files.atuais) {
    for(let i = 0; i < req.files.atuais.length; i++){
        let oldPath = path.resolve(__dirname, '..', req.files.atuais[i].path);
        let newPath = path.resolve(__dirname, '..', 'public', 'images','dados', 'materialBase','atual', req.files.atuais[i].originalname);
        
        fs.rename(oldPath,newPath,erro =>{
            if(erro){
                console.log("erro")
            }
        })

        req.body.figurasAtuais[i]={
            "nome": req.files.atuais[i].originalname
        }
    } 
  }else{
    req.body.figurasAtuais[0]={
      "nome": "placeholder.png"
    }
  }

  if(Array.isArray(req.body['tipo'])){
    entidades=[]
    for (let i = 0; i < req.body['entidade'].length; i++){
      entidades[i]={
          'tipo':req.body['tipo'][i],
          'text':req.body['entidade'][i]
      }
    }
  }else{
    single_entidade={
      'tipo':req.body['tipo'],
      'text':req.body['entidade']
    }
  }
  if(Array.isArray(req.body['descricao_lugar'])){
    req.body['para']=[]
    for (let i = 0; i < req.body['descricao_lugar'].length; i++){
      if(!req.body['lugar'][i]) req.body['lugar'][i]=""
      if(!req.body['data'][i]) req.body['data'][i]=""
      if(!req.body['descricao_lugar'][i]) req.body['descricao_lugar'][i]=""
      req.body['para'][i]={
        "lugar": req.body['lugar'][i],
        "data": req.body['data'][i],
        "entidade": entidades[i],
        "text": req.body['descricao_lugar'][i]
        }
    }
  }else{
    req.body['para']=[]
    if(!req.body['lugar']) req.body['lugar']=""
    if(!req.body['data']) req.body['data']=""
    if(!req.body['descricao_lugar']) req.body['descricao_lugar']=""
      req.body['para'][0]={
        "lugar": req.body['lugar'],
        "data": req.body['data'],
        "entidade": single_entidade,
        "text": req.body['descricao_lugar']
        }
  }

  console.log("HERE IT ISSS")
  console.log(req.body)
  axios.post(env.apiAccessPoint + "/ruas",req.body)
  .then(response => {
    res.render('add') //adicionar arg extra a informar de que correu bem
  }).catch(err => {
    res.render('error', {error: err})
  })
});

router.get('/ruas/edit/:idRua',verificaToken , function(req, res, next) {
    axios.get(env.apiAccessPoint+"/ruas/"+req.params.idRua)
    .then(rua =>{
      //console.log(rua)
      //console.log(rua.data)
      res.render('edit',{street:rua.data})
    }).catch(err => (
      res.render('error',{error: err})
  ))
});

router.post('/ruas/edit/:idRua', verificaToken ,upload.fields([{ name: 'antigas', maxCount: 10 }, { name: 'atuais', maxCount: 10 }]),  function(req, res, next) {
  
  console.log("TEST do POST do edit")
  //console.log("req.files:", req.files)
  //console.log("req.body:", req.body)
  
  
  // Initializing the arrays to store images data
  req.body.figura=[]
  req.body.figurasAtuais=[]

  // Renaming and saving the path for antigas images
  if (req.files.antigas) {
    for(let i = 0; i < req.files.antigas.length; i++){
        let oldPath = path.resolve(__dirname, '..', req.files.antigas[i].path);
        let newPath = path.resolve(__dirname, '..', 'public', 'images','dados', 'materialBase','imagem', req.files.antigas[i].originalname);
  
        fs.rename(oldPath,newPath,erro =>{
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
  }else{
    req.body.figura[0]={
      "legenda": "placeholder.png",
      "path": "imagem/placeholder.png",
      "id": "placeholder.png"
    }
  }

  // Renaming and saving the path for atuais images
  if (req.files.atuais) {
    for(let i = 0; i < req.files.atuais.length; i++){
        let oldPath = path.resolve(__dirname, '..', req.files.atuais[i].path);
        let newPath = path.resolve(__dirname, '..', 'public', 'images','dados', 'materialBase','atual', req.files.atuais[i].originalname);
        
        fs.rename(oldPath,newPath,erro =>{
            if(erro){
                console.log("erro")
            }
        })

        req.body.figurasAtuais[i]={
            "nome": req.files.atuais[i].originalname
        }
    } 
  }else{
    req.body.figurasAtuais[0]={
      "nome": "placeholder.png"
    }
  }


  // Handle entidade, para and listacasas fields in a similar way as in /add
  let paraArray = [];
  let casaArray = [];
  
  // Ensure that req.body.descricao_lugar is an array before using forEach
  if (Array.isArray(req.body.descricao_lugar)) {
    req.body.descricao_lugar.forEach((item, i) => {
      let paraObject = {
        "text": req.body.descricao_lugar[i],
        "lugar": req.body.lugar[i] ? req.body.lugar[i].split(", ") : [],
        "data": req.body.data[i] ? req.body.data[i].split(", ") : [],
        "entidade": [{
          "text": req.body.entidade[i],
          "tipo": req.body.tipo[i]
        }]
      };
      paraArray.push(paraObject);
    });
  } else {
    let paraObject = {
      "text": req.body.descricao_lugar,
      "lugar": req.body.lugar ? req.body.lugar.split(", ") : [],
      "data": req.body.data ? req.body.data.split(", ") : [],
      "entidade": [{
        "text": req.body.entidade,
        "tipo": req.body.tipo
      }]
    };
    paraArray.push(paraObject);
  }

  if (Array.isArray(req.body.descricao)) {
    req.body.descricao.forEach((item, i) => {
      let entidadeTexts = req.body.entidade_casa[i] ? req.body.entidade_casa[i].split(", ") : [];
      let entidadeTipos = req.body.tipo_entidade_casa[i] ? req.body.tipo_entidade_casa[i].split(", ") : [];
      let entidades = [];
  
      // Create an array of entidade objects
      for (let j = 0; j < Math.min(entidadeTexts.length, entidadeTipos.length); j++) {
        let entidade = {
          text: entidadeTexts[j] || '',
          tipo: entidadeTipos[j] || ''
        };
        entidades.push(entidade);
      }
  
      let casaObject = {
        "desc": {
          "para": {
            "text": req.body.descricao[i],
            "data": Array.isArray(req.body.data_casa) ? req.body.data_casa[i] : req.body.data_casa.split(", "),
            "lugar": req.body.lugar_casa[i] ? req.body.lugar_casa[i].split(", ") : [],
            "entidade": entidades
          }
        },
        "enfiteuta": req.body.enfiteuta[i],
        "foro": req.body.foro[i],
        "número": req.body.numero[i]
      };
      casaArray.push(casaObject);
    });
  } else {
    let entidadeTexts = req.body.entidade_casa ? req.body.entidade_casa.split(", ") : [];
    let entidadeTipos = req.body.tipo_entidade_casa ? req.body.tipo_entidade_casa.split(", ") : [];
    let entidades = [];
  
    // Create an array of entidade objects
    for (let j = 0; j < Math.min(entidadeTexts.length, entidadeTipos.length); j++) {
      let entidade = {
        text: entidadeTexts[j] || '',
        tipo: entidadeTipos[j] || ''
      };
      entidades.push(entidade);
    }
  
    let casaObject = {
      "desc": {
        "para": {
          "text": req.body.descricao,
          "data": Array.isArray(req.body.data_casa) ? req.body.data_casa : req.body.data_casa.split(", "),
          "lugar": req.body.lugar_casa ? req.body.lugar_casa.split(", ") : [],
          "entidade": entidades
        }
      },
      "enfiteuta": req.body.enfiteuta,
      "foro": req.body.foro,
      "número": req.body.numero
    };
    casaArray.push(casaObject);
  }
  
  let formattedBody = {
    "_id": req.body.idRua,
    "nome": req.body.nome,
    "figura": req.body.figura,
    "figurasAtuais": req.body.figurasAtuais,
    "para": paraArray,
    "listacasas": casaArray
  };


  //console.log(formattedBody)
  console.log("quase a acabar")

  // Update the street info in the database
  axios.put(env.apiAccessPoint + "/ruas/" + req.params.idRua, formattedBody)
  .then(response => {
      console.log("dentro do put")
      res.redirect('/ruas'); //redirect to the list of streets
  })
  .catch(err => {
      console.log("dentro do put, mas erro")
      res.render('error', {error: err});
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
  fs.rename(oldPath,newPath,erro =>{
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
