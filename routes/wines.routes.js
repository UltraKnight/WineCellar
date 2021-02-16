/**
 * wines from the selected cellar
*/

const express = require('express');
const Cellar = require('../models/Cellar.model');
const Wine = require('../models/Wine.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');
const countryList = require('country-list');

//get all wines
router.get('/cellars/:cellarId/wines', requireLogin, async (req, res, next) => {
  try {
    //Get current cellar
    let cellar = await Cellar.findById(req.params.cellarId).populate('wines');
    //Get wines that are in this cellar
    res.render('wines-list', {cellar});
  } catch (error) {
   next();
   return error;
  }
});

//add form
router.get('/cellars/:cellarId/wines/add', requireLogin, async (req, res, next) => {
  try {
    let wines = await Wine.find();
    res.render('wines-add', {cellarId: req.params.cellarId, wines, countryList: countryList.getNames()});
  } catch (error) {
    next();
    return error;
  }
});

//add form with id
router.post('/cellars/:cellarId/wines/add/info', requireLogin, async (req, res, next) => {
  try {
    let wines = await Wine.find();
    let selectedWine = await Wine.findById(req.body.wineId);
    res.render('wines-add', {selectedWine, cellarId: req.params.cellarId, wines, countryList: countryList.getNames()});
  } catch (error) {
    next();
    return error;
  }
});

//add wine
router.post('/cellars/:cellarId/wines/add', requireLogin, async (req, res) => {
  //name, country, year, annotations, type, blend, abv, drinkUntil, bottleSize, closure
  let {wineId} = req.body;
  let cellarId = req.params.cellarId;

  try{
    await Cellar.findByIdAndUpdate(cellarId, {$push: {wines: wineId}});
    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    res.render('wines-create');
  }
});

//create form
router.get('/cellars/:cellarId/wines/create', requireLogin, async (req, res) => {
  res.render('wines-create', {cellarId: req.params.cellarId, countryList: countryList.getNames()});
});
                  
//create wine
router.post('/cellars/:cellarId/wines', requireLogin, async (req, res) => {
  //name, country, year, annotations, type, blend, abv, drinkUntil, bottleSize, closure
  let {name, country, year, annotations, type, blend, abv, drinkUntil, bottleSize, closure} = req.body;
  let cellarId = req.params.cellarId;
  //create the wine and add it to the cellar
  try {
    const createdWine = await Wine.create({
        name,
        country,
        year,
        annotations,
        type,
        blend,
        abv,
        drinkUntil,
        bottleSize,
        closure
    });

    await Cellar.findByIdAndUpdate(cellarId, {$push: {wines: createdWine.id}});

    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    res.render('wines-create');
  }
});

//delete wine
router.post('/cellars/:cellarId/wines/:wineId/delete', requireLogin, async (req, res, next) => {
  try {
    let cellarId = req.params.cellarId;
    let wineId = req.params.wineId;
    //remove wine from collecion
    await Wine.findByIdAndDelete(wineId);
    //remove this wine from Cellar
    await Cellar.findByIdAndUpdate(cellarId, {$pull: { wines: {_id: wineId}}});

    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    next();
    return error;
  }
});

//update wine form
router.get('/cellars/:cellarId/wines/:wineId/edit', requireLogin, async (req, res, next) => {
  try {
    let cellar = await Cellar.findById(req.params.cellarId);
    let wine = await Wine.findById(req.params.wineId);
    let types = ['red', 'white', 'rose', 'sparkling', 'green', 'porto', 'dessert'];
    res.render('wines-edit', {types, wine, cellar, countryList: countryList.getNames()});
  } catch (error) {
    next();
    return error;
  }
});

//edit form
router.post('/cellars/:cellarId/wines/:wineId', requireLogin, async (req, res, next) => {
  try {
    let cellarId = req.params.cellarId;
    let {name, country, year, annotations, type, blend, abv, drinkUntil, bottleSize, closure} = req.body;
    await Wine.findByIdAndUpdate(req.params.wineId, {$set: {
      name,
      country,
      year,
      annotations,
      type,
      blend,
      abv,
      drinkUntil,
      bottleSize,
      closure
    }});
    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    next();
    return error;
  }
});

//show details
router.get('/cellars/:cellarId/wines/:wineId', requireLogin, async (req, res) => {
  let wineId = req.params.wineId;
  try {
      let wine = await Wine.findById(wineId);
      res.render('wines-details', {wine, cellarId : req.params.cellarId});
  } catch (error) {
    res.render('index', {errorMessage: 'The page you tried to access is not working right now, give it a time!'});
    return error;
  }
});

module.exports = router;