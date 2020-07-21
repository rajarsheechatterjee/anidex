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
    const animeUrl = "https://api.jikan.moe/v3/top/anime/" + page;

    request(animeUrl, (error, response, body) => {
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
    const mangaUrl = "https://api.jikan.moe/v3/top/manga/" + page;

    request(mangaUrl, (error, response, body) => {
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

router.get("/anime/:mal_id", function (req, res) {

    const mal_id = req.params.mal_id;
    const animeDataUrl = "https://api.jikan.moe/v3/anime/" + mal_id;

    request(animeDataUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
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


router.get("/manga/:mal_id", function (req, res) {

    const mal_id = req.params.mal_id;
    const mangaDataUrl = "https://api.jikan.moe/v3/manga/" + mal_id;

    request(mangaDataUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
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

router.get("/person/:mal_id", function (req, res) {

    const mal_id = req.params.mal_id;
    const persondata_url = "https://api.jikan.moe/v3/person/" + mal_id;

    request(persondata_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
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

router.get("/anime/:mal_id/recommendations", (req, res) => {

    const mal_id = req.params.mal_id;
    const animeRecomUrl = "https://api.jikan.moe/v3/anime/" + mal_id + "/recommendations";

    request(animeRecomUrl, (error, response, body) => {
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

router.get("/manga/:mal_id/recommendations", (req, res) => {

    const mal_id = req.params.mal_id;
    const mangaRecomUrl = "https://api.jikan.moe/v3/manga/" + mal_id + "/recommendations";

    request(mangaRecomUrl, (error, response, body) => {
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

router.get("/studio/:producerId", (req, res) => {

    const producerId = req.params.producerId;
    const studioUrl = "https://api.jikan.moe/v3/producer/" + producerId;

    request(studioUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("studio", {
                data: data
            });
        }
    });
});

/**
 * Returns anime weekly schedule
 */

router.get("/schedule", (req, res) => {

    const scheduleUrl = "https://api.jikan.moe/v3/schedule";

    request(scheduleUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("schedule", {
                data: data
            });
        }
    });
});

/**
 * Returns episodes of an anime
 * 
 *  @param mal_id if of the anime
 *  @param page page number
 */

router.get("/anime/:mal_id/episodes/:page", (req, res) => {

    const page = req.params.page;
    const mal_id = req.params.mal_id;

    const episodesUrl = "https://api.jikan.moe/v3/anime/" + mal_id + "/episodes/" + page;

    request(episodesUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("episodes", {
                data: data,
                page: page,
                mal_id: mal_id
            });
        }
    });
});

module.exports = router;