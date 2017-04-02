var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var valorRetirado = 0;

//Instanciando a variável db, para poder utilizar as funções do transaction.
var db = new Sequelize('postgres', 'postgres', '33619898', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
/* GET users listing. */
db
  .authenticate()
  .then(function (err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });


//Irá renderizar a página de transferencia.
router.get('/', function (req, res, next) {
  models.usuario.findAll().then(function (usuarios) {
    res.render('trans', { title: 'Usuários', usuarios: usuarios });
  });

});

//O que fará com as informações recebida no formulário.
router.post('/', function (req, res) {

  //Puxando informações digitadas no formulário e levando para variáveis.
  var usuario = req.body.usuario;
  var conta_t = req.body.conta_t;
  var conta_r = req.body.conta_r;
  var valor = req.body.valor;
  var agencia_t = req.body.agencia_t;
  var agencia_r = req.body.agencia_r;


    db.transaction(function (t) {

      // Vamos transferir dinheiro de um usuário 

      return models.usuario.find({ where: { conta: conta_t, agencia: agencia_t } }).then(function (usuario) {

        // Retiramos o valor digitado no formulario a ser transferido

        //Verifica se usuario existe. (No Where tbm verifica)
        if (usuario)
          usuario.set('valor', usuario.get('valor') - parseFloat(valor))
        else
          console.log('Conta não existente!');

        return usuario.save({ transaction: t })
      },

        //

         models.usuario.find({ where: { conta: conta_r, agencia: agencia_r } }).then(function (usuario) {

          // Retiramos o valor reais do usuário
          if (usuario)
            usuario.set('valor', usuario.get('valor') + parseFloat(valor))
          else
            console.log('Conta não existente!');

          return usuario.save({ transaction: t })
        },

          { transaction: t }).then(function (usuario) {

            // Verificamos se a conta dele ainda está positiva
            if (usuario.get('valor') < valor)
              throw new Error('Sem fundos suficientes');
          }));

    }).then(function () {

      console.log('Dinheiro debitado com sucesso!');
    }).catch(function (err) {
      console.log('Não foi possível debitar por: %s', err.message);
    });


    
    res.redirect('/trans');
  }

  );

module.exports = router;
