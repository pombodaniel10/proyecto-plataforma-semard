var mqtt = require('mqtt');

var options = {
    port: process.env.MQTT_PORT,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
};
var client = mqtt.connect('mqtt://m12.cloudmqtt.com', options);

client.on('connect', function () {
  console.log("Conectado al broker.");
  client.subscribe('outStepper');
  client.subscribe('inStepper');
  client.subscribe('prrito');
  client.subscribe('encenderFoco');
  client.subscribe('foco_cambio');
  client.subscribe('foco_estado');
});

client.on('error', function () {
  console.log("error");
});

client.on('offline', function () {
  console.log("offline");
});


const mqttclient = module.exports = client;
