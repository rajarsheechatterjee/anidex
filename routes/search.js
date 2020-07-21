const express = require("express");
const router = express.Router();
const request = require("request");

/**
 * Returns anime of a specified genre
 * 
 *  @param queryType type of query anime/manga/person/character
 *  @param query the search query
 */

router.get("/search", (req, res) => {

    const queryType = req.query.type;
    const query = req.query.search;

    const searchUrl = "https://api.jikan.moe/v3/search/" + queryType + "?q=" + query;

    request(searchUrl, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.render("search", {
                data: data
            });
        }
    });
});

module.exports = router;