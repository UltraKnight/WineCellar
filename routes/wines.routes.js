/**
 * wines from the selected cellar
*/

const express = require('express');
const Cellar = require('../models/Cellar.model');
const Wine = require('../models/Wine.model');
const Opened = require('../models/Opened.model');
const User = require('../models/User.model');
const Achievement = require('../models/Achievement.model');
const router = express.Router();
const requireLogin = require('../configs/access-control.config');
const countryList = require('country-list');

//get all wines
router.get('/cellars/:cellarId/wines', requireLogin, async (req, res, next) => {
  try {
    const achievement = req.session.achievement;
    //Get current cellar
    let cellar = await Cellar.findById(req.params.cellarId).populate('wines');

    if(achievement) {
      req.session.achievement = undefined;
    }

    res.render('wines-list', {cellar, achievement});
  } catch (error) {
   next();
   return error;
  }
});

//add form
router.get('/cellars/:cellarId/wines/add', requireLogin, async (req, res, next) => {
  try {
    let user = req.session.currentUser;
    let arrUsers = await User.find({$or: [{username: [user.username, 'WineKeeper']}, {friends: user._id}]}).select('_id');
    let wines = await Wine.find({createdBy: arrUsers}).populate('createdBy');
    res.render('wines-add', {cellarId: req.params.cellarId, wines, countryList: countryList.getNames()});
  } catch (error) {
    next();
    return error;
  }
});

//add form with id
router.post('/cellars/:cellarId/wines/add/info', requireLogin, async (req, res, next) => {
  try {
    let arrUsers = await User.find({username: [req.session.currentUser.username, 'WineKeeper']}).select('_id');
    let wines = await Wine.find({createdBy: arrUsers});
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
    await Cellar.findByIdAndUpdate(cellarId, {$push: {wines: wineId}}).populate('wines');

    //achievement
    let user = req.session.currentUser;
    if(! user.addedFirst) {
      let newUser = await User.findByIdAndUpdate(user._id, {addedFirst: true}, {new:true});
      req.session.currentUser = newUser;
      const achievementName = 'My precious!';
      await Achievement.findOneAndUpdate({name: achievementName}, {$push: {users: user._id}});

      req.session.achievement = achievementName;
      res.redirect(`/cellars/${cellarId}/wines`);
      return;
    }
    //achievement

    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    res.redirect(`/cellars/${cellarId}/wines/add`);
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
  let createdBy = req.session.currentUser._id;
  let cellarId = req.params.cellarId;

  //create the wine and add it to the cellar
  try {
    const createdWine = await Wine.create({
        name,
        createdBy,
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

    const cellar = await Cellar.findByIdAndUpdate(cellarId, {$push: {wines: createdWine.id}}, {new:true}).populate('wines');
    const newUser = await User.findByIdAndUpdate(createdBy, {$inc: {[`createdWines.${type}`] : 1, [`createdWines.total`] : 1}}, {new:true});
    req.session.currentUser = newUser;

    //achievement
    if(! req.session.currentUser.addedFirst) {
      const updatedUser = await User.findByIdAndUpdate(req.session.currentUser._id, {addedFirst: true}, {new:true});
      req.session.currentUser = updatedUser;
      const achievementName = 'My precious!';
      await Achievement.findOneAndUpdate({name: achievementName}, {$push: {users: newUser.id}});

      req.session.achievement = achievementName;
      res.redirect(`/cellars/${cellarId}/wines`);
      return;
    }
    //achievement

    //achievement
    //achievements depending on the wine type
    //every 10 wines of each type will trigger an achievement
    if(newUser.createdWines[type] === 10) {
      //capitalize the first letter of the type (red becomes Red)

      let achievementName = `${type.charAt(0).toUpperCase() + type.slice(1)}-lover`;
      await Achievement.findOneAndUpdate({name: achievementName}, {$push: {users: newUser.id}});

      //if both achievements happen at once
      if(newUser.createdWines.total === 20) {
        await Achievement.findOneAndUpdate({name: `Wine-cannon`}, {$push: {users: newUser.id}});
        achievementName += ' and Wine-cannon';
      }

      req.session.achievement = achievementName;
      res.redirect(`/cellars/${cellarId}/wines`);
      return;
    }
    //achievement

    if(newUser.createdWines.total === 20) {
      const achievementName = `Wine-cannon`;
      await Achievement.findOneAndUpdate({name: achievementName}, {$push: {users: newUser.id}});

      req.session.achievement = achievementName;
      res.redirect(`/cellars/${cellarId}/wines`);
      return;
    }

    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    res.redirect(`/cellars/${cellarId}/wines/create`);
  }
});

//delete wine
router.post('/cellars/:cellarId/wines/:wineId/delete', requireLogin, async (req, res, next) => {
  try {
    let cellarId = req.params.cellarId;
    let wineId = req.params.wineId;
    //remove wine from collecion
    //await Wine.findByIdAndDelete(wineId);
    //remove this wine from Cellar

    const foundCellarWines = await Cellar.findById(cellarId);
    const index =  foundCellarWines.wines.indexOf(wineId);
    foundCellarWines.wines.splice(index, 1);
    await Cellar.findByIdAndUpdate(cellarId, {wines : foundCellarWines.wines});

    res.redirect(`/cellars/${cellarId}/wines`);
  } catch (error) {
    console.log(error);
    next();
    return error;
  }
});

//open wine
router.post('/cellars/:cellarId/wines/:wineId/open', requireLogin, async (req, res, next) => {
  try {
    let cellarId = req.params.cellarId;
    let wineId = req.params.wineId;
    let {name, event, year, openingDate, type} = req.body;
    let createdBy = req.session.currentUser._id;
    //remove wine from collecion
    //await Wine.findByIdAndDelete(wineId);
    //remove this wine from Cellar
    await Cellar.findByIdAndUpdate(cellarId, {$pull: { wines: wineId}});
    if(openingDate) {
      await Opened.create({
        name,
        event,
        year,
        openingDate,
        type,
        createdBy
      });
    } else {
      await Opened.create({
        name,
        event,
        year,
        type,
        createdBy
      });
    }
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
    
    if(wine.createdBy != req.session.currentUser._id) {
      res.redirect(`/cellars/${cellar.id}/wines`);
      return;
    }

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
    //res.render('index', {errorMessage: 'The page you tried to access is not working right now, give it a time!'});
    req.session.errorMessage = 'The page you tried to access is not working right now, give it a time!';
    res.redirect('/');
    return error;
  }
});

module.exports = router;