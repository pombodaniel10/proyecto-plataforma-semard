"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');


//Autorizar
router.post('/authenticate', (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({"success":false, "msg": 'Usuario incorrecto o inexistente'});
    }

    User.comparePassword(password, user.password, (err,isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user.toJSON(),config.secret, { expiresIn: "2h" });
        res.json({
          "success":true,
          "token":'JWT '+token,
          "user": {
            "id": user._id,
            "name": user.name,
            "username": user.username,
            "email": user.email,
            "isAdmin": user.isAdmin
          }
        });
      } else {
        return res.json({"success":false, "msg": 'Contraseña incorrecta'});
      }
    });
  });
});

//Obtener perfil
router.get('/profile', passport.authenticate('jwt',{ session: false }),(req,res,next) => {
  res.json({user: req.user});
});

//Obtener Usuarios
router.get('/admin',  passport.authenticate('jwt',{ session: false }), (req,res,next) => {
  User.getUsers((err,users) => {
      if(err) throw err;
      if(!users){
        return res.json({"success":false, "msg": 'Usuarios no encontrados.'});
      } else {
        return res.json({"success":true, "users": users});
      }
  });
});

//Salir
router.get('/logout',  passport.authenticate('jwt',{ session: false }), (req,res,next) => {
  return res.json({"success":true, "msg": 'Logout'});
});

//Registrar
router.post('/register', passport.authenticate('jwt',{ session: false }),(req,res,next) => {
  if(req.user){
    if(req.user.isAdmin){
      let newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
      });
      User.addUser(newUser, (err,user) => {
        if(err){
          var errorUser = err.toJSON();
          if(errorUser.code==11000){
            res.json({"success":false, "msg":'El nombre de usuario o el correo ya existe.'});
          }else{
              res.json({"success":false, "msg":'Error al intentar registrar al usuario'});
          }
        }else{
          res.json({"success":true, "msg":'Registro exitoso!'});
        }
      });
    } else {
      res.json({"success":false, "msg":'Acción no autorizada para el usuario actual'});
    }

  } else {
    res.json({"success":false, "msg":'No autorizado'});
  }
});

//Elminiar
router.delete('/deleteuser', passport.authenticate('jwt',{ session: false }),(req,res,next) => {
  if(req.user){
    if(req.user.isAdmin){
      User.deleteUser(req.body._id,(err,user) => {
        if(err){
          res.json({"success":false, "msg":'Error al intentar eliminar al usuario'});
        }if(user){
          res.json({"success":true,"msg":"Usuario eliminado."});
        }
      });

    } else {
      res.json({"success":false, "msg":'Acción no autorizada para el usuario actual'});
    }
  } else {
    res.json({"success":false, "msg":'No autorizado'});
  }
});


module.exports = router;
