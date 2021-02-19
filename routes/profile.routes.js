const express = require('express');
const User = require('../models/User.model');
const Achievement = require('../models/Achievement.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');
const fileUpload = require('../configs/cloudinary');
const WineModel = require('../models/Wine.model');

//see user data
router.get('/profile', requireLogin, async (req, res, next) => {
  let achievement = req.query.achievement || null;
  try {
    const wineLoverMeterOptions = [
      "Wine Enthusiast (Love wine)",
      "Wine&Social (Drink socially)",
      "Grape Lover (Prefer grapes juice but drinks a glass once in a while)"
    ]
    res.render('profile', {user : req.session.currentUser, achievement, wineLoverMeterOptions});
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
   
    res.render('user-list', { profile: user });
  });
});
/* cloudinary test end */


//switch settings save

//for wine switches
router.post('/profile/favorite-wine-type', requireLogin, async (req, res, next) => {
  
  let {red, white, rose, sparkling, dessert, green, porto } = req.body;
  red = red ? true : false;
  white = white ? true : false;
  rose = rose ? true : false;
  sparkling = sparkling ? true : false;
  dessert = dessert ? true : false;
  green = green ? true : false;
  porto = porto ? true : false;

    User.findByIdAndUpdate((req.session.currentUser._id), {
      $set:{red, white, rose, sparkling, dessert, green, porto}
}, {new: true}
).then((newUser) => {
    req.session.currentUser = newUser;
    res.redirect('/profile');
  }); 
});

//winelovers meter

router.post('/profile/wine-lover', requireLogin, async (req, res, next) => {
  let { wineLoverMeter } = req.body;



  User.findByIdAndUpdate((req.session.currentUser._id), {wineLoverMeter}, {new: true}
).then((newUser) => {
  req.session.currentUser = newUser;
  res.redirect('/profile');
}); 
});


module.exports = router;