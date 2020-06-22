var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    request        = require("request"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user"),
    methodOverride = require("method-override");


var Jikan = require('jikan-node');
var mal = new Jikan();

mongoose.connect("mongodb://localhost/Anidex", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//================================================================ INDEX PAGE =================================================================

app.get("/", function(req, res){
    res.redirect("/top/anime/1");
});

//================================================================ CURRENT SEASON PAGE =================================================================

app.get("/season/2020/spring", function(req, res){
    var season_url = "https://api.jikan.moe/v3/season/2020/spring";
    request(season_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("currentseason", {data: data});
        }
    });
});

//============================================================ WEEKLY SCHEDULE PAGE =============================================================

app.get("/schedule", function(req, res){
    var schedule_url = "https://api.jikan.moe/v3/schedule";
    request(schedule_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("schedule", {data: data});
        }
    });
});

//============================================================ SEASON ARCHIVE PAGE =============================================================

app.get("/season/archive", function(req, res){
    var schedule_url = "https://api.jikan.moe/v3/season/archive";
    request(schedule_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("seasonarchive", {data: data});
        }
    });
});

//============================================================ SEASONS ANIME PAGE =============================================================

app.get("/season/:year/:season", function(req, res){
    var year = req.params.year;
    var season = req.params.season;
    var schedule_url = "https://api.jikan.moe/v3/season/" + year + "/" + season;
    request(schedule_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("seasonanime", {data: data});
        }
    });
});

//======================================================== TOP RATED ANIME AND MANGA PAGE =========================================================

app.get("/top/anime/:page", function(req, res){
    var page = req.params.page;
    var url = "https://api.jikan.moe/v3/top/anime/" + page;
    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("anime", {data: data, page: page});
        }
    });
});

app.get("/manga", function(req, res){
    var manga_url = "https://api.jikan.moe/v3/top/manga";
    request(manga_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("manga", {data: data});
        }
    });
});

app.get("/top/anime/", function(req, res){
    res.redirect("/top/anime/1");
});

//============================================================ SEARCH PAGE =============================================================

app.get("/search", function(req, res){
    var query_type = req.query.type;
    var query = req.query.search;
    var search_url = "https://api.jikan.moe/v3/search/" + query_type + "?q=" + query;
    request(search_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("search", {data: data});
        }
    });
});

//============================================================ SHOW PAGE =============================================================

app.get("/anime/:mal_id", function(req, res){
    var mal_id = req.params.mal_id;
    var animedata_url = "https://api.jikan.moe/v3/anime/" + mal_id;
    request(animedata_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("animedata", {data: data, mal_id: mal_id});
        }
    });
});

app.get("/manga/:mal_id", function(req, res){
    var mal_id = req.params.mal_id;
    var mangadata_url = "https://api.jikan.moe/v3/manga/" + mal_id;
    request(mangadata_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("mangadata", {data: data, mal_id: mal_id});
        }
    });
});

//========================================================= SHOW EPISODE DATA PAGE ==========================================================

app.get("/anime/:mal_id/episodes", function(req, res){
    var mal_id = req.params.mal_id;
    var epi_url = "https://api.jikan.moe/v3/anime/" + mal_id + "/episodes";
    request(epi_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("episodes", {data: data, mal_id: mal_id});
        }
    });
});

//========================================================= RECOMMENDATIONS PAGE ==========================================================

app.get("/anime/:mal_id/recommendations", function(req, res){
    var mal_id = req.params.mal_id;
    var recom_url = "https://api.jikan.moe/v3/anime/" + mal_id + "/recommendations";
    request(recom_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("recommendations", {data: data, mal_id: mal_id});
        }
    });
});

//============================================================ GENRE PAGE =============================================================

app.get("/genre", function(req, res){
    res.render("genre");
});

app.get("/mangagenre", function(req, res){
    res.render("genrem");
});


//========================================================= ANIMES IN A GENRE ==========================================================

app.get("/genre/:genre_id", function(req, res){
    var genre_id = req.params.genre_id;
    var genreanime_url = "https://api.jikan.moe/v3/genre/anime/" + genre_id;
    request(genreanime_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("genreanime", {data: data, genre_id: genre_id});
        }
    });
});

//========================================================= MANGAS IN A GENRE ==========================================================

app.get("/mangagenre/:genre_id", function(req, res){
    var genre_id = req.params.genre_id;
    var genreanime_url = "https://api.jikan.moe/v3/genre/manga/" + genre_id;
    request(genreanime_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("genremanga", {data: data, genre_id: genre_id});
        }
    });
});

//======================================================== USER PROFILE ROUTE ==================================================================

app.get("/user/:username/profile", isLoggedIn, function(req, res){
    var username = req.params.username;
    var al_url = "https://api.jikan.moe/v3/user/" + username + "/profile";
    request(al_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("userprofile", {data: data});
        }
    });
});

//============================================================ ANIMELIST ROUTE ======================================================================

app.get("/user/:username/animelist", isLoggedIn, function(req, res){
    var username = req.params.username;
    var al_url = "https://api.jikan.moe/v3/user/" + username + "/animelist";
    request(al_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("animelist", {data: data});
        }
    });
});

//============================================================ MANGALISTS ROUTE ======================================================================

app.get("/user/:username/mangalist", isLoggedIn, function(req, res){
    var username = req.params.username;
    var al_url = "https://api.jikan.moe/v3/user/" + username + "/mangalist";
    request(al_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("mangalist", {data: data});
        }
    });
});

//============================================================ LOGIN PAGE =============================================================

app.get("/login", function(req, res){
    res.render("login"); 
});

app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/top/anime/1",
    failureRedirect: "/login"
}), function(req, res){
});

//============================================================ REGISTER PAGE =============================================================

app.get("/register", function(req, res){
    res.render("register"); 
});
 
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/top/anime/1");
        });
    });
});

//=========================================================== LOGOUT ROUTE =====================================================================

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/top/anime/1");
});

//=========================================================== MIDDLEWARE =====================================================================

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("The Anidex Server Has Started");
});