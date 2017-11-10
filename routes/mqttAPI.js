"use strict"
const express = require('express');
const router = express.Router();
const clientMQTT = require('../middlewares/mqtt');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const ws = new WebSocket('ws://127.0.0.1:'+PORT);
const Blackout = require('../models/blackout');
const Luces = require('../models/luces');

ws.on('message', function incoming(message) {
  var json = JSON.parse(message);

  switch (json.type) {
    case "blackout":
      var stepper = {
        "sentido":json.message.sentido,
        "vueltas":json.message.vueltas
      };

      clientMQTT.publish('inStepper',JSON.stringify(stepper), (err) => {
        if(err){
          let dataError = {
            'type': "errorBlackout",
            'message': err
          }
          ws.send(JSON.stringify(dataError));
        }
      });
    break;
    case "luces":
      var luces = {"status":json.message.status};
      clientMQTT.publish('encenderFoco',JSON.stringify(luces), (err) => {
        if(err){
          let dataError = {
            'type': "errorLuces",
            'message': err
          }
          ws.send(JSON.stringify(dataError));
        }
      });
    break;
    case "blackoutRDATA":
      let blackoutDATA = {
        'type': "blackoutDATA",
        'message': {
          'lunes': 0,
          'martes': 0,
          'miercoles': 0,
          'jueves': 0,
          'viernes': 0,
          'sabado': 0,
          'domingo': 0
        }
      }
      Blackout.getALLData((err,data)=>{

        if(err) throw err;
        if(!data){
          ws.send(JSON.stringify(blackoutDATA));
        } else {
          for(var x=0; x<data.length; x++)
          {
            var d = new Date(data[x].time);
            var actual = new Date();
            if(d.getMonth()==actual.getMonth()
              &&d.getFullYear()==actual.getFullYear()){
              switch (d.getDay()) {
                case 1:
                  blackoutDATA.message.lunes +=1;
                break;
                case 2:
                  blackoutDATA.message.martes +=1;
                break;
                case 3:
                  blackoutDATA.message.miercoles +=1;
                break;
                case 4:
                  blackoutDATA.message.jueves +=1;
                break;
                case 5:
                  blackoutDATA.message.viernes +=1;
                break;
                case 6:
                  blackoutDATA.message.sabado +=1;
                break;
                case 0:
                  blackoutDATA.message.domingo +=1;
                break;
              }
            }

          }
          ws.send(JSON.stringify(blackoutDATA));
        }
      });
  }
});

function error(type){
  let dataError = {
    'type': type,
    'message': "El dispositivo no responde."
  }
  ws.send(JSON.stringify(dataError));
}


clientMQTT.on('message', function (topic, message) {
    var timer = null;
    var timer2 = null;
    try{
      switch (topic) {
        case "inStepper":
          timer = setTimeout(error, 10000,'errorBlackout');
        break;
        case "outStepper":
          clearTimeout(timer);
          var resJSON = JSON.parse(message.toString());
          if(resJSON.estado=="girando"||resJSON.estado=="finalizado"){
            let blackout = new Blackout({
              'username': "default",
              'estado': "Blackout en movimiento",
              'time': new Date()
            });
            blackout.save(function (err){
              if (err) return handleError(err);  // saved!
            });
          }
          let blackoutOut = {
            'type': "blackoutOut",
            'message': resJSON
          }
          ws.send(JSON.stringify(blackoutOut));
        break;
        case "encenderFoco":
          timer2 = setTimeout(error, 10000,'errorLuces');
        break;
        case "foco_cambio":
          clearTimeout(timer2);
          let luces = new Luces({
            'foco': "foco 1",
            'estado': "foco up/down",
            'username': "default",
            'time': new Date()
          });
          luces.save(function (err){
            if (err) return handleError(err);  // saved!
          });
          let lucesOut = {
            'type': "lucesOut",
            'message': JSON.parse(message.toString())
          }
          ws.send(JSON.stringify(lucesOut));
        break;
        case "foco_estado":

          let lucesESTADO = {
            'type': "lucesESTADO",
            'message': JSON.parse(message.toString())
          }
          console.log(lucesESTADO);
          ws.send(JSON.stringify(lucesESTADO));
        break;
      }
    } catch (e) {
      if(e instanceof SyntaxError){
      console.log("Error al procesar el JSON.");
    }
  }
});

module.exports = router;
