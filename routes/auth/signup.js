const express = require('express');
const router  = express.Router();
//const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

module.exports = router;