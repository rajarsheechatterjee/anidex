const express = require("express");
const router = express.Router();
const request = require("request");

/**
 * Returns top anime of all time
 * 
 *  @param page page number
 */

router.get("/top/anime/:page", (req, res) => {
    const page = req.params.page;
    const url = "https://api.jikan.moe/v3/top/anime/" + page;
    request(url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("topanime", {
                data: data,
                page: page
            });
        }
    });
});

/**
 * Redirects to page 1 of top anime
 */

router.get("/top/anime/", (req, res) => {
    res.redirect("/top/anime/1");
});

/**
 * Returns top manga of all time
 * 
 *  @param page page number
 */

router.get("/top/manga/:page", (req, res) => {
    const page = req.params.page;
    const manga_url = "https://api.jikan.moe/v3/top/manga/" + page;
    request(manga_url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("topmanga", {
                data: data,
                page: page
            });
        }
    });
});

/**
 * Redirects to page 1 of top manga
 */

router.get("/top/manga/", (req, res) => {
    res.redirect("/top/manga/1");
});


/**
 * Returns details of a anime
 * 
 *  @param mal_id id of the anime
 */

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

/**
 * Returns details of a manga
 * 
 *  @param mal_id id of the manga
 */


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

/**
 * Returns details of a person
 * 
 *  @param mal_id id of the person
 */

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

/**
 * Returns recommendations for a anime
 * 
 *  @param mal_id id of the anime
 */

app.get("/anime/:mal_id/recommendations", (req, res) => {
    const mal_id = req.params.mal_id;
    const recom_url = "https://api.jikan.moe/v3/anime/" + mal_id + "/recommendations";
    request(recom_url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("animerecommendations", {
                data: data
            });
        }
    });
});

/**
 * Returns recommendations for a manga
 * 
 *  @param mal_id id of the manga
 */

app.get("/manga/:mal_id/recommendations", (req, res) => {

    const mal_id = req.params.mal_id;
    const recom_url = "https://api.jikan.moe/v3/manga/" + mal_id + "/recommendations";

    request(recom_url, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("mangarecommendations", {
                data: data
            });
        }
    });
});

/**
 * Returns details of a studio/producer
 * 
 *  @param producerId id of the studio/producer
 */

app.get("/studio/:producerId", (req, res) => {

    var producerId = req.params.producerId;
    var studioUrl = "https://api.jikan.moe/v3/producer/" + producerId;

    request(studioUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            res.render("studio", {
                data: data
            });
        }
    });
});

module.exports = router;