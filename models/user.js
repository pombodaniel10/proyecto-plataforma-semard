const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User Schema
const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    maxlength:[20,'Nombre usuario muy grande.'],
    index: { unique: true }
  },
  email: {
    type: String,
    required:true,
    index: { unique: true }
  },
  password: {
    type: String,
    required:true,
    minlength:[8,'La contraseña es muy corta.']
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
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

module.exports.getUsers = function(callback){
  User.find(callback);
}

module.exports.deleteUser = function(id,callback){
  User.deleteOne({"_id":id},callback);
}
