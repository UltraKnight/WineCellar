const express = require('express');
const User = require('../models/User.model');
const Achievement = require('../models/Achievement.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');
const fileUpload = require('../configs/cloudinary');

//see user data
router.get('/profile', requireLogin, async (req, res, next) => {
  let achievement = req.query.achievement || null;
  try {
    res.render('profile', {user : req.session.currentUser, achievement});
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

    if(!username) {
      res.render('profile', {user: req.session.currentUser, errorMessage: 'Username can\'t be empty!'});
      return;
    }

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

/* to test cloudinary */
//add profile photo

router.get('/profile/update-profile-pic', (req, res) => {
  res.render('profile-create'); 
});


router.post('/profile/update-profile-pic', fileUpload.single('image'), async (req, res) => {
  //pass middleware . The 'image' on sigle comes from the input image on "FIND PLACE"
  if(! req.file) {
    res.redirect('/profile');
    return;
  }

  const fileUrlOnCloudinary = req.file.path;
  //first upload image from cloudinary with the name from the form
  
  try {
    await User.findByIdAndUpdate((req.session.currentUser._id), {$set: {imageURL: fileUrlOnCloudinary} });
    req.session.currentUser.imageURL = fileUrlOnCloudinary;
    
    if(!req.session.currentUser.picChanged) {
      const newUser = await User.findByIdAndUpdate(req.session.currentUser._id, {picChanged : true}, {new:true});
      req.session.currentUser = newUser;
      //achievement
      let achievementName = 'Waiter, another shot, please!';
      await Achievement.findOneAndUpdate({name: achievementName}, {$push: {users: newUser.id}});      
      let achievement = encodeURIComponent(achievementName);
      res.redirect(`/profile/?achievement=` + achievement);
      //achievement
      return;
    }

    res.redirect('/profile');
  } catch (error) {
    return error;
  }
});


router.get('/profile', (req, res) => {
  User.find()
  .then((user) => {
    res.render('user-list', { profile: user});
  });
});


/* cloudinary test end */

module.exports = router;