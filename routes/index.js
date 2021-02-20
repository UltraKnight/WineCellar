const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  let errorMessage = req.session.errorMessage;
  let achievement = req.session.achievement;
  if(errorMessage) {
    req.session.errorMessage = undefined;
  }

  if(achievement) {
    req.session.achievement = undefined;
  }

  res.render('index', {errorMessage, achievement});
});

module.exports = router;