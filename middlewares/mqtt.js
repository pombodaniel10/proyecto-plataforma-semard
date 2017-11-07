var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://m12.cloudmqtt.com',{
  port: 12489,
  clientId: "Severo perro pirobo",
  username:"xbvmyoxh",
  password:"nJzjyl5r-7GD"
});

client.on('connect', function () {
  console.log("Conectado al broker.");
  client.subscribe('outStepper');
  client.subscribe('inStepper');
  client.subscribe('prrito');
  client.subscribe('foco_estado');
});

client.on('error', function () {
  console.log("error");
});

client.on('offline', function () {
  console.log("offline");
});


module.exports = client;
