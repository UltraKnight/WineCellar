/**
 * cellars - based on cellar model
 * name, place, wines, capacity
 */

const express = require('express');
const Cellar = require('../models/Cellar.model');
const User = require('../models/User.model');
const Achievement = require('../models/Achievement.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');

//get all cellars
router.get('/cellars', requireLogin, async (req, res, next) => {
  const achievement = req.session.achievement;

  if(achievement) {
    req.session.achievement = undefined;
  }
  try {
    let cellars = await Cellar.find({createdBy:req.session.currentUser._id});
    res.render('cellars-list', {cellars, achievement});
  } catch (error) {
    console.log(error);
    next();
    return error;
  }
});

//create form
router.get('/cellars/create', requireLogin, async (req, res) => {
  res.render('cellars-create');
});

//create new cellar
router.post('/cellars', requireLogin, async (req, res) => {
  //wines is empty on creation
  let {name, place, /*wines,*/ capacity} = req.body;
  let createdBy = req.session.currentUser._id;
  try {
    await Cellar.create({
      name,
      place,
      wines: [],
      capacity,
      createdBy,
    });

    //new: true -> returns the changed document
    const newUser = await User.findByIdAndUpdate(createdBy, {$inc: {createdCellars : 1}}, {new: true});
    req.session.currentUser = newUser;

    //Achievement
    if(newUser.createdCellars === 1) {
      const achievementName = 'Keep it safe';
      await Achievement.findOneAndUpdate({name: achievementName}, {$push: {users: newUser.id}});

      req.session.achievement = achievementName;
      res.redirect('/cellars');
      return;
    }
    //Achievement

    res.redirect('/cellars');
  } catch (error) {
    res.redirect('/cellars/create');
  }
});

//delete cellar
router.post('/cellars/:id/delete', requireLogin, async (req, res, next) => {
  try {
    let id = req.params.id;
    let cellar = await Cellar.findById(id);

    if(cellar.createdBy != req.session.currentUser._id) {
      res.redirect('/cellars');
      return;
    }

    await Cellar.findByIdAndDelete(id);
    res.redirect('/cellars');
  } catch (error) {
    next();
    return error;
  }
});

//update cellar form
router.get('/cellars/:id/edit', requireLogin, async (req, res, next) => {
  const errorMessage = req.session.errorMessage;
  if(errorMessage) {
    req.session.errorMessage = undefined;
  }

  try {
    let cellar = await Cellar.findById(req.params.id);
    res.render('cellars-edit', {cellar, errorMessage});
  } catch (error) {
    next();
    return error;
  }
});

//edit form
router.post('/cellars/:id', requireLogin, async (req, res, next) => {
  try {
    let {name, place, capacity} = req.body;
    const cellar = await Cellar.findById(req.params.id);

    if(cellar.wines.length > capacity) {
      req.session.errorMessage = 'You can\'t have more wines than free spaces in your cellar.';
      res.redirect(`/cellars/${cellar.id}/edit`);
      return;
    }

    if(capacity <= 0) {
      req.session.errorMessage = 'You need to have at least one space in your cellar.';
      res.redirect(`/cellars/${cellar.id}/edit`);
      return;
    }

    if(!name) {
      req.session.errorMessage = 'Your wine cellar must have a name.';
      res.redirect(`/cellars/${cellar.id}/edit`);
      return;
    }

    if(cellar.createdBy != req.session.currentUser._id) {
      res.redirect('/cellars');
      return;
    }

    await Cellar.findByIdAndUpdate(req.params.id, {$set: {name, place, capacity}});
    res.redirect('/cellars');
  } catch (error) {
    next();
    return error;
  }
});

//show details
router.get('/cellars/:id', requireLogin, async (req, res) => {
  let id = req.params.id;
  try {
      let cellar = await Cellar.findById(id).populate('wines');

      if(cellar.createdBy != req.session.currentUser._id) {
        res.redirect('/cellars');
        return;
      }

      res.render('cellars-details', {cellar});
  } catch (error) {
    req.session.errorMessage = 'The page you tried to access is not working right now, give it a time!';
    res.redirect('/');
    return error;
  }
});

module.exports = router;
