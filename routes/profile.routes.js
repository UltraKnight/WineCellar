const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');

//see user data
router.get('/profile', requireLogin, async (req, res, next) => {
  try {
    res.render('profile', {user : req.session.currentUser});
  } catch (error) {
    next();
    return error;
  }
});

//delete account
router.post('/profile/delete', requireLogin, async (req, res, next) => {
  try {
    let userId = req.body.id;
    req.session.currentUser = null;
    //remove user's wines from collecion
    await User.findByIdAndDelete(userId);
    res.redirect('/');
  } catch (error) {
    next();
    return error;
  }
});


//change username
router.post('/profile/:id/new-username', requireLogin, async (req, res, next) => {
  try {
    let {username} = req.body;
    if (username === req.session.currentUser.username) {
      res.redirect('/profile');
      return;
    }

    await User.findByIdAndUpdate(req.params.id, {$set: {username}});
    req.session.currentUser.username = username;
    res.render('profile', {user: req.session.currentUser, message: 'Username updated!'});
  } catch (error) {
    if(error.code === 11000) {
      res.render('profile', {user: req.session.currentUser, errorMessage: 'This username already exists!'});
    }
    return error;
  }
});

/*
//add profile photo
router.get('/profile/:id/profile-photo', requirePhoto, async (req, res, next) => {
  try {
    let {imageURL} = req.body;
    await User.
  }
})  */

module.exports = router;