var mqtt = require('mqtt');

var options = {
    port: 12489,
    username: 'xbvmyoxh',
    password: 'nJzjyl5r-7GD',
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


module.exports = client;
