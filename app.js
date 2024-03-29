require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const helpers = require("handlebars-helpers");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("./configs/db.config");

//Make handlebars helpers available on our views
hbs.registerHelper(helpers());

hbs.registerHelper("ifEq", function (n1, n2, options) {
  if (n1 == n2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//// Express Session Setup
app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
      sameSite: false,
      httpOnly: true,
    },
    rolling: true,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      //ttl: 60 * 60 * 24
    }),
  })
);
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "WineKeeper";

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth.routes");
app.use("/", auth);

const cellar = require("./routes/cellars.routes");
app.use("/", cellar);

const wines = require("./routes/wines.routes");
app.use("/", wines);

const api = require("./routes/apitest.routes");
app.use("/", api);

const profile = require("./routes/profile.routes");
app.use("/", profile);

const opened = require("./routes/opened.routes");
app.use("/", opened);

//to use cloudinary same as line 94 and 95

const achievement = require("./routes/achievement.routes");
app.use("/", achievement);

module.exports = app;
