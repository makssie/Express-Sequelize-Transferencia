var express = require('express');
var router = express.Router();
var models = require ('../models');
var trans = require('../models/usuario');
/* GET users listing. */
router.get('/', function(req, res, next) {
  models.usuario.findAll().then(function(usuarios){
      res.render('usuarios', {title: 'Usuários', usuarios:usuarios });
  }) ;
  
});

router.post('/',function(req,res){
  var usuario = req.body.usuario;
  models.usuario.create(usuario).then(function(){
     res.redirect('users');
  });
  
});


router.post('/trans',function(req,res){
  console.log('teste'); 
  res.render('index');
  
});


module.exports = router;
