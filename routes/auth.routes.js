const express = require('express');
const router  = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const {mailModule, mailOptions} = require('../configs/nodemailer.config');

router.get('/signup', (_req, res) => {
    res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;

  if(username === '' || password === '') {
      res.render('/signup', {errorMessage: 'Username and password must be filled and valid'});

      return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if(! passwordRegex.test(password)) {
      res.render('auth/signup', {errorMessage: `Your password must contain at least 1 of each: 
          lowercase letter, uppercase letter, number and have six or more characters`});

      return;
  }

  const user = await User.findOne({username: username});
  if(user) {
      res.render('auth/signup', {errorMessage: 'Unfortunatly someone already has your username :('});

      return;
  }

  //Create the user
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);

  try {
      await User.create({
          username,
          email,
          password: hashPass
      });

    mailOptions.to = email; //user email
    // send mail with defined transport object
    mailModule.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

      res.redirect('/');
  } catch (err) {
      if(err.code === 11000) {
          res.render('auth/signup', {errorMessage: 'Username or e-mail already registered'});
      }
  }
});

module.exports = router;