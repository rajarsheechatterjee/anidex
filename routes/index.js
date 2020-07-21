const express = require("express");
const router = express.Router();
const request = require("request");

function apiCall(reqOps) {
    return new Promise(function (resolve, reject) {

        request(reqOps, (err, res, body) => {

            if (!err && res.statusCode == 200) {
                resolve(JSON.parse(body));
            }

            reject(err);
        });

    });
}

const currentSeason = {
    url: "https://api.jikan.moe/v3/season/2020/summer",
    headers: {
        'Identifier': 'identifier'
    }
};

const topAnime = {
    url: "https://api.jikan.moe/v3/top/anime",
    headers: {
        'Identifier': 'identifier'
    }
};

const topAnimeAiring = {
    url: "https://api.jikan.moe/v3/top/anime/1/airing",
    headers: {
        'Identifier': 'identifier'
    }
};

const topAnimeUpcoming = {
    url: "https://api.jikan.moe/v3/top/anime/1/upcoming",
    headers: {
        'Identifier': 'identifier'
    }
};

/**
 * Returns top, airing, upcoming anime & current season
 */

router.get("/index", function (req, res) {

    let data1, data2, data3, data4;

    apiCall(currentSeason)
        .then(result => {
            data1 = result;

            return apiCall(topAnime);
        })
        .then(result => {
            data2 = result;

            return apiCall(topAnimeAiring);
        })
        .then(result => {
            data3 = result;

            return apiCall(topAnimeUpcoming);
        })
        .then(result => {
            data4 = result;

            res.render("index", {
                data1,
                data2,
                data3,
                data4
            });
        })
        .catch(err => {
            console.log("Error occured in one of the API call: ", err);
        });
});

/**
 * Redirects to the index page
 */

router.get("/", (req, res) => {
    res.redirect("index");
});

module.exports = router;