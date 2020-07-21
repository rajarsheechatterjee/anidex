const express = require("express");
const router = express.Router();
const request = require("request");

/**
 * Returns the MAL profile of the current user
 * 
 *  @param username the myanimelist username of the cuurent user
 */

router.get("/user/:username/profile", isLoggedIn, (req, res) => {

    const username = req.params.username;
    const userProfileUrl = "https://api.jikan.moe/v3/user/" + username + "/profile";

    request(userProfileUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("userprofile", {
                data: data
            });
        }
    });
});

/**
 * Returns MAL's animelist of a user
 * 
 *  @param username the myanimelist username of the cuurent user
 */

router.get("/user/:username/animelist", isLoggedIn, (req, res) => {

    const username = req.params.username;
    const animeListUrl = "https://api.jikan.moe/v3/user/" + username + "/animelist";

    request(animeListUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("animelist", {
                data: data
            });
        }
    });
});

/**
 * Returns MAL's mangalist of a user
 * 
 *  @param username the myanimelist username of the cuurent user
 */

router.get("/user/:username/mangalist", isLoggedIn, (req, res) => {

    const username = req.params.username;
    const mangaListUrl = "https://api.jikan.moe/v3/user/" + username + "/mangalist";

    request(mangaListUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("mangalist", {
                data: data
            });
        }
    });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;