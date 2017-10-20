var mqtt = require('mqtt');

var client  = mqtt.connect('mqtt://test.mosquitto.or',{
  port: 1883,
  clientId: "Severo perro pirobo",
});

client.on('connect', function () {
  console.log("conectado al broker.");
  client.subscribe('outStepper');
  client.subscribe('inStepper');
});

client.on('error', function () {
  console.log("error");
});

client.on('offline', function () {
  console.log("offline");
});


module.exports = client;
