const mongoose = require('mongoose');

const blackoutSchema = new mongoose.Schema({
  username:{
    type: String
  },
  estado:{
    type: String
  },
  time:{
    type: String
  }
});

const Blackout = module.exports = mongoose.model('Blackout',blackoutSchema);

module.exports.getALLData = function(callback){
  Blackout.find(callback);
}
