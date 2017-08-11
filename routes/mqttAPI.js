"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const clientMQTT = require('../middlewares/mqtt');

//Blackout enviar
router.post('/blackout', passport.authenticate('jwt',{ session: false }), (req,res,next) => {
  var sen = req.body.sentido;
  var vue = req.body.vueltas;

  var stepper = {"vueltas": parseInt(vue), "sentido":sen};
  var myJSON = JSON.stringify(stepper);

  clientMQTT.publish('inStepper',myJSON, (err) => {
    if(err){
      return res.json({"success":false, "msg": 'Error al enviar el mensaje'});
    } else {
      return res.json({"success":false, "msg": 'JSON enviado'});
    }
  });

});

//Blackout recibir
router.get('/blackout', passport.authenticate('jwt',{ session: false }), (req,res,next) => {

});

module.exports = router;
