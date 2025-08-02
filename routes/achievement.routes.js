const express = require('express');
const router  = express.Router();
const Achievement = require('../models/Achievement.model');
const requireLogin = require('../configs/access-control.config');

//see achievements
router.get('/achievements', requireLogin, async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;
    const achievements = await Achievement.find({users : userId});
    res.render('achievements', {achievements});
  } catch (error) {
    next();
    return error;
  }
});

module.exports = router;
