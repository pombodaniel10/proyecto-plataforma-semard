"use strict"
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');


//Authenticate
router.post('/authenticate', (req,res,next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({"success":false, "msg": 'User not found'});
    }

    User.comparePassword(password, user.password, (err,isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user,config.secret, { expiresIn: "12h" });
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
        return res.json({"success":false, "msg": 'Wrong password'});
      }
    });
  });
});

//Profile
router.get('/profile', passport.authenticate('jwt',{ session: false }),(req,res,next) => {
  res.json({user: req.user});
});

//Get users
router.get('/admin',  passport.authenticate('jwt',{ session: false }), (req,res,next) => {
  User.getUsers((err,users) => {
      if(err) throw err;
      if(!users){
        return res.json({"success":false, "msg": 'Users not found'});
      } else {
        return res.json({"success":true, "users": users});
      }
  });
});

//logout
router.get('/logout',  passport.authenticate('jwt',{ session: false }), (req,res,next) => {
  return res.json({"success":true, "msg": 'Logout'});
});

//Register
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
          res.json({"success":false, "msg":'Failed to register user'});
        }else{
          res.json({"success":true, "msg":'User registered'});
        }
      });
    } else {
      res.json({"success":false, "msg":'Unathorized action for current user'});
    }

  } else {
    res.json({"success":false, "msg":'Unathorized, login first'});
  }
});

module.exports = router;
