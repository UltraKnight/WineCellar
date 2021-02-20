const express = require('express');
const User = require('../models/User.model');
const Achievement = require('../models/Achievement.model');
const Request = require('../models/Request.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');
const fileUpload = require('../configs/cloudinary');
const wineLoverMeterOptions = [
  "Wine Enthusiast (Love wine)",
  "Wine&Social (Drink socially)",
  "Grape Lover (Prefer grapes juice but drinks a glass once in a while)"
];

//see user data
router.get('/profile', requireLogin, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.currentUser._id).populate('friends');
    const sent = await Request.find({from: user.username});
    const received = await Request.find({to: user.username});
    const message = req.session.message;
    const errorMessage = req.session.errorMessage;
    const achievement = req.session.achievement;

    if(errorMessage) {
      req.session.errorMessage = undefined;
    }

    if(message) {
      req.session.message = undefined;
    }

    if(achievement) {
      req.session.achievement = undefined;
    }

    res.render('profile', {user, wineLoverMeterOptions, sent, received, message, errorMessage, achievement});
  } catch (error) {
    next();
    return error;
  }
});

//add friend
router.post('/profile/add', requireLogin, async (req, res, next) => {
  try {
    const user = await User.findById(req.session.currentUser._id).populate('friends');
    const from = user.username;
    const {to} = req.body;

    if(! to) {
      res.redirect('/profile');
      return;
    }

    const foundUser = await User.findOne({username:to});
    if(! foundUser) {
      req.session.errorMessage = 'This user was not found';
      res.redirect('/profile');
      return;
    }

    if(foundUser.username === from) {
      res.redirect('/profile');
      return;
    }

    //verify if you already sent a friend request to this user
    let foundSent = await Request.find({from, to});
    if(foundSent.length) {
      req.session.errorMessage = `Friend request already sent to ${to}`;
      res.redirect('/profile');
      return;
    }
    
    //verify if this user already sent a friend request to you
    let foundReceived = await Request.find({from: to, to: from});
    if(foundReceived.length) {
      req.session.errorMessage = `${to} already sent a friend request to you`;
      res.redirect('/profile');
      return;
    }

    //verify if you are already friends
    let foundFriend = await User.findOne({friends : foundUser.id});
    if(foundFriend) {
      req.session.errorMessage = `You are already friends!`;
      res.redirect('/profile');
      return;
    }

    await Request.create({
      from,
      to
    });

    req.session.message = `Friend request sent to ${to}`;
    res.redirect('/profile');
  } catch (error) {
    next();
    return error;
  }
});

//remove friend
router.post('/profile/friend-delete', requireLogin, async (req, res) => {
  let {id} = req.body;

  try {
    await User.findByIdAndUpdate(req.session.currentUser._id, {$pull: {friends: id}});
    await User.findByIdAndUpdate(id, {$pull: {friends: req.session.currentUser._id}});

    res.redirect('/profile');
  } catch (error) {
    res.redirect('/profile');
    return error;
  }
});

//remove friend request
router.post('/profile/request-delete', requireLogin, async (req, res) => {
  let {id} = req.body;
  try {
    await Request.findByIdAndDelete(id);
    res.redirect('/profile');
  } catch (error) {
    res.redirect('/profile');
    return error;
  }
});

//accept friend request
router.post('/profile/request-accept', requireLogin, async (req, res) => {
  let sender;
  try {
    const {id} = req.body;
    const request = await Request.findById(id);
  
    if(! request) {
      req.session.errorMessage = `This friend request was deleted by the sender.`;
      res.redirect('/profile');
      return;
    }
  
    sender = await User.findOne({username: request.from});
  
    //add both friends
    await User.findByIdAndUpdate(req.session.currentUser._id, {$push: {friends : sender.id}});
    await User.findByIdAndUpdate(sender.id, {$push: {friends : req.session.currentUser._id}});
    //remove Request
    await Request.findByIdAndDelete(id);

    req.session.message = 'Friend added';
    res.redirect('/profile');
  } catch (error) {
    console.log(error);
    res.redirect('/profile');
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

/* to test cloudinary */
//add profile photo

router.post('/profile/update-profile-pic', requireLogin, fileUpload.single('image'), async (req, res) => {
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
      
      req.session.achievement = achievementName;
      //res.render('profile', {user: newUser, achievement: achievementName});
      res.redirect('/profile');
      //achievement
      return;
    }

    res.redirect('/profile');
  } catch (error) {
    return error;
  }
});


// router.get('/profile', (req, res) => {
//   User.find()
//   .then((user) => {
   
//     res.render('user-list', { profile: user });
//   });
// });
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

//change username
router.post('/profile/:id/new-username', requireLogin, async (req, res, next) => {
  try {
    let {username} = req.body;

    if(!username) {
      req.session.errorMessage = `Username can't be empty!`;
      res.redirect('/profile');
      return;
    }

    if (username === req.session.currentUser.username) {
      res.redirect('/profile');
      return;
    }

    await User.findByIdAndUpdate(req.params.id, {$set: {username}});
    req.session.currentUser.username = username;
    req.session.message = 'Username updated!';
    res.redirect('/profile');
  } catch (error) {
    if(error.code === 11000) {
      req.session.errorMessage = 'This username already exists!';
      res.redirect('/profile');
    }
    return error;
  }
});

router.get('/profile/:username', requireLogin, async (req, res) => {
  try {
    let friend = await User.findOne({username: req.params.username});

    //verify if this user is your friend
    if(! friend.friends.includes(req.session.currentUser._id)) {
      res.redirect('/profile');
      return;
    }

    //verify if the user exists
    if(! friend) {
      res.redirect('/profile');
      return;
    }

    res.render('friend-profile', {user:friend});
  } catch (error) {
    res.redirect('/profile');
    return error;
  }
});

module.exports = router;