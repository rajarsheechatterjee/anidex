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

var malLogin = {
    url: "https://myanimelist.net/login.php",
    headers: {
        'Identifier': 'identifier'
    }
};

//================================================================ STUDIO PAGE =================================================================

app.get("/studio/:producerId", function (req, res) {
    var producerId = req.params.producerId;
    var season_url = "https://api.jikan.moe/v3/producer/" + producerId;
    request(season_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("studio", {
                data: data
            });
        }
    });
});

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




//======================================================== TOP RATED ANIME AND MANGA PAGE =========================================================

app.get("/top/anime/:page", function (req, res) {
    var page = req.params.page;
    var url = "https://api.jikan.moe/v3/top/anime/" + page;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("topanime", {
                data: data,
                page: page
            });
        }
    });
});

app.get("/top/manga/:page", function (req, res) {
    var page = req.params.page;
    var manga_url = "https://api.jikan.moe/v3/top/manga/" + page;
    request(manga_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("topmanga", {
                data: data,
                page: page
            });
        }
    });
});

app.get("/top/anime/", function (req, res) {
    res.redirect("/top/anime/1");
});

app.get("/top/manga/", function (req, res) {
    res.redirect("/top/manga/1");
});



//============================================================ SHOW PAGE =============================================================

app.get("/anime/:mal_id", function (req, res) {
    var mal_id = req.params.mal_id;
    var animedata_url = "https://api.jikan.moe/v3/anime/" + mal_id;
    request(animedata_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("animedata", {
                data: data
            });
        }
    });
});

app.get("/manga/:mal_id", function (req, res) {
    var mal_id = req.params.mal_id;
    var mangadata_url = "https://api.jikan.moe/v3/manga/" + mal_id;
    request(mangadata_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("mangadata", {
                data: data
            });
        }
    });
});

app.get("/person/:mal_id", function (req, res) {
    var mal_id = req.params.mal_id;
    var persondata_url = "https://api.jikan.moe/v3/person/" + mal_id;
    request(persondata_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("persondata", {
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

//========================================================= RECOMMENDATIONS PAGE ==========================================================

app.get("/anime/:mal_id/recommendations", function (req, res) {
    var mal_id = req.params.mal_id;
    var recom_url = "https://api.jikan.moe/v3/anime/" + mal_id + "/recommendations";
    request(recom_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("animerecommendations", {
                data: data
            });
        }
    });
});

app.get("/manga/:mal_id/recommendations", function (req, res) {
    var mal_id = req.params.mal_id;
    var recom_url = "https://api.jikan.moe/v3/manga/" + mal_id + "/recommendations";
    request(recom_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("mangarecommendations", {
                data: data
            });
        }
    });
});



//=========================================================== MIDDLEWARE =====================================================================

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.use(seasonRoutes);
app.use(userRoutes);
app.use(genreRoutes);
app.use(searchRoutes);
app.use(authRoutes);
app.use(indexRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`The Anidex Server Has Started`));