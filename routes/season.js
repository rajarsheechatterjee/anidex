const express = require("express");
const router = express.Router();
const request = require("request");

/**
 * Returns anime of the current season
 */

router.get("/season/2021/winter", (req, res) => {
    const season_url = "https://api.jikan.moe/v3/season/2021/winter";
    request(season_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("currentseason", { data: data });
        }
    });
});

/**
 * Returns anime of a specified season
 *
 *  @param year the year of the specifies season
 *  @param season whether it's now selected or not.
 */

router.get("/season/:year/:season", (req, res) => {
    const year = req.params.year;
    const season = req.params.season;
    const schedule_url =
        "https://api.jikan.moe/v3/season/" + year + "/" + season;
    request(schedule_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("seasonanime", { data: data });
        }
    });
});

/**
 * Returns anime of all the years & their respective season
 */

router.get("/season/archive", (req, res) => {
    const schedule_url = "https://api.jikan.moe/v3/season/archive";
    request(schedule_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("seasonarchive", { data: data });
        }
    });
});

module.exports = router;
