const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const userSchema = new mongoose.Schema({
  name:{
    type: String
  },
  username: {
    type: String,
    required: true,
    maxlength:[20,'Nombre usuario muy grande.']
  },
  email: {
    type: String,
    required:true},
  password: {
    type: String,
    required:true,
    minlength:[8,'La contraseña es muy corta.']
  },
  isAdmin: Boolean,
});

const User = module.exports = mongoose.model('User',userSchema);

module.exports.getUserById = function(id,callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username,callback){
  const query = {username: username};
  User.findOne(query,callback);
}

module.exports.addUser = function(newUser,callback){
  bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(newUser.password, salt, (err,hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash,(err,isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
