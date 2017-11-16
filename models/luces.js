const mongoose = require('mongoose');

const lucesSchema = new mongoose.Schema({
  foco:{
    type: String
  },
  estado:{
    type: Boolean
  },
  username:{
    type: String
  },
  time:{
    type: String
  }
});

const Luces = module.exports = mongoose.model('Luces',lucesSchema);

module.exports.getALLData = function(callback){
  Luces.find(callback);
}
