require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

require('./configs/db.config');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
//// Express Session Setup
app.use(
  session({
      secret: process.env.SESSION_SECRET,
      cookie: {
          maxAge: 60000,
          sameSite: true,
          httpOnly: true
      },
      rolling: true,
      store: new MongoStore({
          mongooseConnection: mongoose.connection,
          ttl: 60 * 60 * 24
      })
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'VIEWINE';



const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth.routes');
app.use('/', auth);

 const cellar = require('./routes/cellars.routes');
 app.use('/', cellar);

const wines = require('./routes/wines.routes');
app.use('/', wines);

<<<<<<< HEAD
const api = require('./routes/api.routes');
=======
const api = require('./routes/apitest.routes');
>>>>>>> c8468e84d7a1d3b9485b4bfed6736713ee2e5515
app.use('/', api);

module.exports = app;