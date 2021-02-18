const express = require('express');
const Opened = require('../models/Opened.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');

//see memories
router.get('/opened', requireLogin, async (req, res, next) => {
  try {
    const opened = await Opened.find({createdBy:req.session.currentUser._id});
    res.render('opened', {opened});
  } catch (error) {
    next();
    return error;
  }
});

module.exports = router;