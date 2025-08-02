require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const nunjucks = require('nunjucks')
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");

require("./configs/db.config");

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Setup Nunjucks
nunjucks.configure('views'), {
  autoescape: true,
  express: app,
};

// enable file upload
const fileUpload = require('express-fileupload');
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  }),
);

// Middleware Setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session Setup
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

app.engine('njk', nunjucks.render);
app.set("view engine", "njk");
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
