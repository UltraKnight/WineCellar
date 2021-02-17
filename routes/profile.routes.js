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
//not implemented yet

//change username
router.post('/profile/:id/new-username', requireLogin, async (req, res, next) => {
  try {
    let {username} = req.body;
    await User.findByIdAndUpdate(req.params.id, {$set: {username}});
    req.session.currentUser.username = username;
    res.render('profile', {user: req.session.currentUser, message: 'Username updated!'});
  } catch (error) {
    next();
    return error;
  }
});

module.exports = router;