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
    var stepper = {
        "sentido":json.message.sentido,
        "vueltas":json.message.vueltas
      };

    clientMQTT.publish('inStepper',JSON.stringify(stepper), (err) => {
      if(err){
        let dataError = {
          'type': "error",
          'message': err
        }
        ws.send(JSON.stringify(dataError));
      }
    });

  }else if(json.type=="luces"){
    var luces = {"status":json.message.status};
    clientMQTT.publish('encenderFoco',JSON.stringify(luces), (err) => {
      if(err){
        let dataError = {
          'type': "error",
          'message': err
        }
        ws.send(JSON.stringify(dataError));
      } else {
        console.log("enviado.");
      }
    });
  }else if(json.type="error"){

  }
});


clientMQTT.on('message', function (topic, message) {
    var timer = null;
    try{
      if(topic=="inStepper"){
        console.log("mensaje recibido");
        timer = setTimeout(function () {
          console.log("El dispositivo no funciona.");
          let dataError = {
            'type': "error",
            'message': "El dispositivo no responde."
          }
          ws.send(JSON.stringify(dataError));
        }, 10000);
      }else if(topic=="prrito"){
        clearTimeout(timer);
        console.log("mensaje enviado");
        let blackout = new Blackout({
          'username': "default",
          'estado': "Blackout en movimiento",
          'time': new Date()
        });
        blackout.save(function (err){
          if (err) return handleError(err);  // saved!
        });

        let data = {
          'type': "blackoutOut",
          'message': JSON.parse(message.toString())
        }
        ws.send(JSON.stringify(data));
      }else if(topic=="encenderFoco"){

      }
    } catch (e) {
      if(e instanceof SyntaxError){
      console.log("Error al procesar el JSON.");
    }
  }
});

module.exports = router;
