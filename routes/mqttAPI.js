"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const clientMQTT = require('../middlewares/mqtt');
const io = require('socket.io-client');
const socket = io('http://localhost:4000');

clientMQTT.subscribe('outStepper');

//Blackout enviar
router.post('/blackout', passport.authenticate('jwt',{ session: false }), (req,res,next) => {
  var sen = req.body.sentido;
  var vue = req.body.vueltas;

  var stepper = {"sentido":sen,"vueltas":vue};
  var myJSON = JSON.stringify(stepper);

  clientMQTT.publish('inStepper',myJSON, (err) => {
    if(err){
      return res.json({"success":false, "msg": err});
    } else {
      return res.json({"success":true, "msg": 'JSON enviado'});
    }
  });
});

clientMQTT.on('message', function (topic, message) {

  if(topic="outStepper"){
    socket.emit('blackout message', JSON.parse(message.toString()));
  }
});

module.exports = router;
