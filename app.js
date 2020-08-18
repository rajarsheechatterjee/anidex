const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      User = require("./models/user"),
      methodOverride = require("method-override"),
      dotenv = require('dotenv');
      dotenv.config();

const seasonRoutes = require("./routes/season");
const userRoutes = require("./routes/user");
const genreRoutes = require("./routes/genre");
const searchRoutes = require("./routes/search");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const animeAndMangaRoutes = require("./routes/animeAndManga");

mongoose.connect(String(process.env.MONGO_URI), {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret: "anidex",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use(animeAndMangaRoutes);
app.use(searchRoutes);
app.use(seasonRoutes);
app.use(genreRoutes);
app.use(authRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The Anidex Server Has Started`));