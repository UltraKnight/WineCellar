const express = require('express');
const Opened = require('../models/Opened.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');

//see memories
router.get('/opened', requireLogin, async (_req, res, next) => {
  try {
    const opened = await Opened.find();
    res.render('opened', {opened});
  } catch (error) {
    next();
    return error;
  }
});

module.exports = router;