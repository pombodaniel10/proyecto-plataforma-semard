"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const clientMQTT = require('../middlewares/mqtt');
const WebSocket = require('ws');
const port = require('../app');
const ws = new WebSocket('ws://127.0.0.1:'+port);
const Blackout = require('../models/blackout');

ws.on('message', function incoming(message) {
  var json = JSON.parse(message);
  if(json.type=="blackout"){
    var stepper = {"sentido":json.message.vueltas,"vueltas":json.message.sentido};
    clientMQTT.publish('inStepper',stepper, (err) => {
      if(err){
        console.log("error");
        let dataError = {
          'type': "error",
          'message': err
        }
        ws.send(JSON.stringify(dataError));
      }
    });
  }
  if(json.type=="luces"){
    var luces = {"status":json.message.status};
    clientMQTT.publish('encenderFoco',luces, (err) => {
      if(err){
        console.log("error");
        let dataError = {
          'type': "error",
          'message': err
        }
        ws.send(JSON.stringify(dataError));
      }
    });
  }
});


clientMQTT.on('message', function (topic, message) {
    try{
      if(topic="outStepper"){
      let data = {
        'type': "blackout",
        'message': JSON.parse(message.toString())
      }
      ws.send(JSON.stringify(data));
      }

      if(topic="inStepper"){
        let blackout = new Blackout({
          'username': "default",
          'estado': "Blackout en movimiento",
          'time': new Date().toUTCString()
        });
        blackout.save(function (err){
          if (err) return handleError(err);  // saved!
        });
      }
      if(topic="encenderFoco"){

      }

  } catch (e) {
    if(e instanceof SyntaxError){
      console.log("Error al procesar el JSON.");
    }

  }

});

module.exports = router;
