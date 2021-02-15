/**
 * cellars - based on cellar model
 * name, place, wines, capacity
 */

const express = require('express');
const Cellar = require('../models/Cellar.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');

//get all cellars
router.get('/cellars', requireLogin, async (_req, res, next) => {
  try {
    let cellars = await Cellar.find();
    res.render('cellars-list', {cellars});
  } catch (error) {
    next();
    return error;
  }
});

//create form
router.get('/cellars/create', requireLogin, async (_req, res) => {
  res.render('cellars-create');
});

//create new cellar
router.post('/cellars', requireLogin, async (req, res) => {
  //wines is empty on creation
  let {name, place, /*wines,*/ capacity} = req.body;
  try {
    await Cellar.create({
      name,
      place,
      wines: [],
      capacity
    });
    res.redirect('/cellars');
  } catch (error) {
    res.render('cellars-create');
  }
});

//delete cellar
router.post('/cellars/:id/delete', requireLogin, async (req, res, next) => {
  try {
    let id = req.params.id;
    await Cellar.findByIdAndDelete(id);
    res.redirect('/cellars');
  } catch (error) {
    next();
    return error;
  }
});

//update cellar form
router.get('/cellars/:id/edit', requireLogin, async (req, res, next) => {
  try {
    let cellar = await Cellar.findById(req.params.id);
    res.render('cellars-edit', {cellar});
  } catch (error) {
    next();
    return error;
  }
});

//edit form
router.post('/cellars/:id', requireLogin, async (req, res, next) => {
  try {
    let {name, place} = req.body;
    await Cellar.findByIdAndUpdate(req.params.id, {$set: {name, place}});
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
      res.render('cellars-details', {cellar});
  } catch (error) {
    res.render('index', {errorMessage: 'The page you tried to access is not working right now, give it a time!'});
    return error;
  }
});

module.exports = router;