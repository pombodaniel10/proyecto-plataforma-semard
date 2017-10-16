const mongoose = require('mongoose');

const lucesSchema = new mongoose.Schema({
  foco:{
    type: String
  },
  estado:{
    type: String
  },
  username:{
    type: String
  }
  time:{
    type: String
  }
});

const Luces = module.exports = mongoose.model('Luces',lucesSchema);
