var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var redis = require("redis")
var cors = require("cors");
var passport = require("passport");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var LocalStrategy = require("passport-local").Strategy;
var indexRouter = require("./routes/index");
var account = require("./db/account")
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
let RedisStore = require("connect-redis")(session);
let client = redis.createClient({
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT
});

app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
      domain: ".engage.town"
    }
  })
);
var whitelist = new RegExp(
  `^https://([a-z]+\.)?engage.town|localhost:3000$`,
  "i"
);
console.error(`WHITELIST: ${whitelist.source}`);
var corsOptions = {
  origin: function(origin, callback) {
    if (process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      if (whitelist.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(account.authenticate));
passport.serializeUser(account.serializeUser);
passport.deserializeUser(account.deserializeUser);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
