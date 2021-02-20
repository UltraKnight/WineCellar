const express = require('express');
const router  = express.Router();
const User = require('../models/User.model');
const Achievement = require('../models/Achievement.model');
const bcrypt = require('bcrypt');
const { /*gmail*/ outlook, mailOptions} = require('../configs/nodemailer.config'); //choose between gmail or outlook
mailOptions.from = 'WINE CELLAR <vanderlei.i.martins@outlook.com>'; //change sender email here

router.get('/signup', (req, res) => {
    let errorMessage = req.session.errorMessage;
    if(errorMessage) {
        req.session.errorMessage = undefined;
    }

    res.render('auth/signup', {errorMessage});
});

router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;

  if(username === '' || password === '') {
        req.session.errorMessage = 'Username and password must be filled and valid';
        res.redirect('/signup');
        return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if(! passwordRegex.test(password)) {
        req.session.errorMessage = `Your password must contain at least 1 of each: 
        lowercase letter, uppercase letter, number and have six or more characters`;

        res.redirect('/signup');
      return;
  }

  const user = await User.findOne({username});
  if(user) {
      
      req.session.errorMessage = 'Unfortunatly someone already has your username :(';
      res.redirect('/signup');
      return;
  }

  //Create the user
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPass = bcrypt.hashSync(password, salt);
  const imageURL = "/images/profilepicturedefault3.png"; 
  try {
    const createdUser = await User.create({
        username,
        imageURL, 
        email,
        password: hashPass
    });

    mailOptions.to = email; //user email
    // send mail with defined transport object
    outlook.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });

        // achievement
        await Achievement.findOneAndUpdate({name: 'Wine-friendly'}, {$push: {users: createdUser.id}});
        // achievement
        req.session.currentUser = createdUser;
        req.session.achievement = 'Wine-friendly';
        res.redirect('/');
        //res.render('index', {achievement: true});
  } catch (err) {
      if(err.code === 11000) {
          res.render('auth/signup', {errorMessage: 'Username or e-mail already registered'});
      }
  }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        res.render('index', {errorMessage: 'Please fill both fields: username and password'});

        return;
    }

    const user = await User.findOne({username});
    if(!user) {
        res.render('index', {errorMessage: 'Invalid username and password combination'});

        return;
    }

    if(bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect('/cellars');
    } else {
        res.render('index', {errorMessage: 'Invalid username and password combination'});
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;