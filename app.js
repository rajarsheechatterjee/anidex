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


function apiCall (reqOps) {
    return new Promise ( function(resolve, reject){

        request(reqOps, function(err, res, body){

            if(!err && res.statusCode == 200){
                resolve( JSON.parse(body) );                
            }

            reject(err);
        });

    });
}

//================================================================ INDEX PAGE =================================================================

var currentSeason = {
    url: "https://api.jikan.moe/v3/season/2020/spring",
    headers: {
      'Identifier': 'identifier'
    }
};

var topAnime = {
    url: "https://api.jikan.moe/v3/top/anime",
    headers: {
      'Identifier': 'identifier'
    }
};

var topAnimeAiring = {
    url: "https://api.jikan.moe/v3/top/anime/1/airing",
    headers: {
      'Identifier': 'identifier'
    }
};

var topAnimeUpcoming = {
    url: "https://api.jikan.moe/v3/top/anime/1/upcoming",
    headers: {
      'Identifier': 'identifier'
    }
};

app.get("/index", function(req, res){
    
    let data1, data2, data3, data4;

    apiCall(currentSeason)
    .then( result => {
        data1 = result;

        return apiCall(topAnime);
    }) 
    .then( result => {
        data2 = result;

        return apiCall(topAnimeAiring);
    })
    .then( result => {
        data3 = result;

        return apiCall(topAnimeUpcoming);
    })
    .then( result => {
        data4 = result;

        res.render("index", {data1, data2, data3, data4});
    })
    .catch( err => {
        console.log("Error occured in one of the API call: ", err);
    });
});

app.get("/", function(req, res){
    res.redirect("index");
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

//================================================================ STUDIO PAGE =================================================================

app.get("/studio/:producerId", function(req, res){
    var producerId = req.params.producerId;
    var season_url = "https://api.jikan.moe/v3/producer/" + producerId;
    request(season_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("studio", {data: data});
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
            res.render("topanime", {data: data, page: page});
        }
    });
});

app.get("/top/manga/:page", function(req, res){
    var page = req.params.page;
    var manga_url = "https://api.jikan.moe/v3/top/manga/" + page;
    request(manga_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("topmanga", {data: data, page: page});
        }
    });
});

app.get("/top/anime/", function(req, res){
    res.redirect("/top/anime/1");
});

app.get("/top/manga/", function(req, res){
    res.redirect("/top/manga/1");
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
            res.render("animedata", {data: data});
        }
    });
});

app.get("/manga/:mal_id", function(req, res){
    var mal_id = req.params.mal_id;
    var mangadata_url = "https://api.jikan.moe/v3/manga/" + mal_id;
    request(mangadata_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("mangadata", {data: data});
        }
    });
});

//========================================================= SHOW EPISODE DATA PAGE ==========================================================

app.get("/anime/:mal_id/episodes/:page", function(req, res){
    var page = req.params.page;
    var mal_id = req.params.mal_id;
    var epi_url = "https://api.jikan.moe/v3/anime/" + mal_id + "/episodes/" + page;
    request(epi_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("episodes", {data: data, page: page, mal_id: mal_id});
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
            res.render("animerecommendations", {data: data});
        }
    });
});

app.get("/manga/:mal_id/recommendations", function(req, res){
    var mal_id = req.params.mal_id;
    var recom_url = "https://api.jikan.moe/v3/manga/" + mal_id + "/recommendations";
    request(recom_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("mangarecommendations", {data: data});
        }
    });
});

//============================================================ GENRE PAGE =============================================================

app.get("/genre/anime", function(req, res){
    res.render("animegenres");
});

app.get("/genre/manga", function(req, res){
    res.render("mangagenres");
});


//========================================================= ANIMES IN A GENRE ==========================================================

app.get("/genre/anime/:genre_id", function(req, res){
    var genre_id = req.params.genre_id;
    var genreanime_url = "https://api.jikan.moe/v3/genre/anime/" + genre_id;
    request(genreanime_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("genreanime", {data: data});
        }
    });
});

//========================================================= MANGAS IN A GENRE ==========================================================

app.get("/genre/manga/:genre_id", function(req, res){
    var genre_id = req.params.genre_id;
    var genreanime_url = "https://api.jikan.moe/v3/genre/manga/" + genre_id;
    request(genreanime_url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            res.render("genremanga", {data: data});
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