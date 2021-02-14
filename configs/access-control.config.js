function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.render('index', {errorMessage: 'You must be logged in to access your private area'});
  }
}

module.exports = requireLogin;