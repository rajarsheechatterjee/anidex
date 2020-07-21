const express = require("express");
const router = express.Router();
const request = require("request");

/**
 * Returns all the anime genres
 */

router.get("/genre/anime", (req, res) => {
    res.render("animegenres");
});

/**
 * Returns all the manga genres
 */

router.get("/genre/manga", (req, res) => {
    res.render("mangagenres");
});


/**
 * Returns anime of a specified genre
 * 
 *  @param genre_id the id of the specified genre
 */
router.get("/genre/anime/:genre_id", (req, res) => {

    const genre_id = req.params.genre_id;
    const animeGenresUrl = "https://api.jikan.moe/v3/genre/anime/" + genre_id;

    request(animeGenresUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("genreanime", {
                data: data
            });
        }
    });
});


/**
 * Returns manga of a specified genre
 * 
 *  @param genre_id the id of the specified genre
 */

router.get("/genre/manga/:genre_id", (req, res) => {

    const genre_id = req.params.genre_id;
    const mangaGenresUrl = "https://api.jikan.moe/v3/genre/manga/" + genre_id;

    request(mangaGenresUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("genremanga", {
                data: data
            });
        }
    });
});

module.exports = router;