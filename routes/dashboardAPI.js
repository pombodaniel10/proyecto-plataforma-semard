"use strict"
const express = require('express');
const router = express.Router();
const clientMQTT = require('../middlewares/mqtt');
const WebSocket = require('ws');
const PORT = process.env.PORT || 8080;
const ws = new WebSocket('ws://127.0.0.1:'+PORT);
const Blackout = require('../models/blackout');
const Luces = require('../models/luces');

var timer;
var timer2;

function registrosBlackout(){
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

function registrosLuces(){
  let lucesDATA = {
    'type': "lucesDATA",
    'message': {
      'on': {
        'lunes': 0,
        'martes': 0,
        'miercoles': 0,
        'jueves': 0,
        'viernes': 0,
        'sabado': 0,
        'domingo': 0
      },
      'off': {
        'lunes': 0,
        'martes': 0,
        'miercoles': 0,
        'jueves': 0,
        'viernes': 0,
        'sabado': 0,
        'domingo': 0
      }
    }
  }
  function onOff(estado,diaon,diaoff){
    if(estado==true){
      diaon +=1;
    }else{
      diaoff +=1;
    }
  }
  Luces.getALLData((err,data)=>{

    if(err) throw err;
    if(!data){
      ws.send(JSON.stringify(lucesDATA));
    } else {
      for(var x=0; x<data.length; x++)
      {
        var d = new Date(data[x].time);
        var actual = new Date();
        if(d.getMonth()==actual.getMonth()&&d.getFullYear()==actual.getFullYear()){
          switch (d.getDay()) {
              case 1:
                if(data[x].estado==true){
                  lucesDATA.message.on.lunes+=1;
                }else{
                  lucesDATA.message.off.lunes+=1;
                }
              break;
              case 2:
                if(data[x].estado==true){
                  lucesDATA.message.on.martes+=1;
                }else{
                  lucesDATA.message.off.martes+=1;
                }
              break;
              case 3:
                if(data[x].estado==true){
                  lucesDATA.message.on.miercoles+=1;
                }else{
                  lucesDATA.message.off.miercoles+=1;
                }
              break;
              case 4:
                if(data[x].estado==true){
                  lucesDATA.message.on.jueves+=1;
                }else{
                  lucesDATA.message.off.jueves+=1;
                }
              break;
              case 5:
                if(data[x].estado==true){
                  lucesDATA.message.on.viernes+=1;
                }else{
                  lucesDATA.message.off.viernes+=1;
                }
              break;
              case 6:
                if(data[x].estado==true){
                  lucesDATA.message.on.sabado+=1;
                }else{
                  lucesDATA.message.off.sabado+=1;
                }
              break;
              case 0:
                if(data[x].estado==true){
                  lucesDATA.message.on.domingo+=1;
                }else{
                  lucesDATA.message.off.domingo+=1;
                }
              break;
          }
        }
      }
      ws.send(JSON.stringify(lucesDATA));
    }
  });

}

function enviarEstado(type,resJSON) {
  let message = {
    'type': type,
    'message': resJSON
  }
  ws.send(JSON.stringify(message));
}

function enviarTarea(topic,tarea){
  clientMQTT.publish(topic,tarea, (err) => {
    if(err){
      var typeErr;
      if(tarea.type=="blackout"){
        typeErr="errorBlackout";
      }else if(tarea.type=="luces"){
        typeErr="errorLuces";
      }
      enviarEstado(typeErr,err);
    }
  });
}

function procesarTarea(tarea) {
  switch (tarea.type) {
    case "blackout":
      var stepper = {"sentido":tarea.message.sentido,"vueltas":tarea.message.vueltas};
      enviarTarea('inStepper',JSON.stringify(stepper));
      timer = setTimeout(enviarEstado, 10000,'errorBlackout','El gestor del motor no responde.');
    break;
    case "luces":
      var luces = {"status":tarea.message.status};
      enviarTarea('encenderFoco',JSON.stringify(luces));
      timer2 = setTimeout(enviarEstado, 10000,'errorLuces','El gestor de las luces no responde.');
    break;
    case "blackoutRDATA":
      registrosBlackout();
    break;
    case "lucesRDATA":
      registrosLuces();
    break;
  }
}

function onMessageWS(){
  //Se procesa y se envia la tarea
  ws.on('message', function incoming(message) {
    var json = JSON.parse(message);
    procesarTarea(json);
  });
}

function respuestaDispositivo(topic,message){
  timer = null;
  timer2 = null;
  switch (topic) {
    case "outStepper":
      clearTimeout(timer);
      timer = null;
      var resBLACKOUT = JSON.parse(message.toString());
      if(resBLACKOUT.estado=="finalizado"){
        let blackout = new Blackout({
          'username': "default",
          'estado': resBLACKOUT.estado,
          'time': new Date()
        });
        blackout.save(function (err){
          if (err) return handleError(err);  // saved!
        });
      }
      enviarEstado("blackoutOut",resBLACKOUT);
    break;
    case "foco_cambio":
      clearTimeout(timer2);
      timer2 = null;
      var resLUCES = JSON.parse(message.toString());
      let luces = new Luces({
        'foco': "foco 1",
        'estado': resLUCES.status,
        'username': "default",
        'time': new Date()
      });
      luces.save(function (err){
        if (err) return handleError(err);  // saved!
      });
      enviarEstado("lucesOut",resLUCES);
    break;
    case "foco_estado":
      var resfocoestado = JSON.parse(message.toString());
      enviarEstado("lucesESTADO",resfocoestado);
    break;
  }
}

function onMessageMQTT(){
  //Se procesa la respuesta del dispositivo
  clientMQTT.on('message', function (topic, message) {
      try{
        respuestaDispositivo(topic,message);
      } catch (e) {
        if(e instanceof SyntaxError){
        console.log("Error al procesar el JSON.");
      }
    }
  });
}

onMessageWS();
onMessageMQTT();

module.exports = router;
