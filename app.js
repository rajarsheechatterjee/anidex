const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    request = require("request"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override");

const seasonRoutes = require("./routes/season");
const userRoutes = require("./routes/user");
const genreRoutes = require("./routes/genre");
const searchRoutes = require("./routes/search");
const authRoutes = require("./routes/auth");
const indexRoutes = require("./routes/index");
const animeAndMangaRoutes = require("./routes/animeAndManga");

mongoose.connect("mongodb://localhost/Anidex", {
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




//================================================================ MAL AUTHENTICATION =================================================================

// var malLogin = {
//     url: "https://myanimelist.net/login.php",
//     headers: {
//         'Identifier': 'identifier'
//     }
// };

//============================================================ WEEKLY SCHEDULE PAGE =============================================================

app.get("/schedule", function (req, res) {
    var schedule_url = "https://api.jikan.moe/v3/schedule";
    request(schedule_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("schedule", {
                data: data
            });
        }
    });
});










//========================================================= SHOW EPISODE DATA PAGE ==========================================================

app.get("/anime/:mal_id/episodes/:page", function (req, res) {
    var page = req.params.page;
    var mal_id = req.params.mal_id;
    var epi_url = "https://api.jikan.moe/v3/anime/" + mal_id + "/episodes/" + page;
    request(epi_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("episodes", {
                data: data,
                page: page,
                mal_id: mal_id
            });
        }
    });
});



app.use(seasonRoutes);
app.use(userRoutes);
app.use(genreRoutes);
app.use(searchRoutes);
app.use(authRoutes);
app.use(indexRoutes);
app.use(animeAndMangaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The Anidex Server Has Started`));