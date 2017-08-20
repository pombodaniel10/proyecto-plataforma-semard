"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const clientMQTT = require('../middlewares/mqtt');
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

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
    var data = {
      'type': "blackout",
      'message': JSON.parse(message.toString())
    }
    ws.send(JSON.stringify(data));
  }
});

module.exports = router;
