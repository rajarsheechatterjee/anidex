const express = require("express");
const router = express.Router();
const passport = require("passport");
const cheerio = require("cheerio");
const User = require("../models/user");
const request = require("request");

// const malUrl = {
//   url: "http://myanimelist.net/login.php",
//   headers: {
//     "content-type": "application/x-www-form-urlencoded",
//   },
// };

request("http://myanimelist.net/login.php", (err, res, body) => {
  if (err) throw err;

  const $ = cheerio.load(body);

  const csrfToken = $("meta[name=csrf_token]").attr("content");

  router.post("/login", (req, res) => {
    const options = {
      user_name: req.body.username,
      password: req.body.password,
      csrf_token: csrfToken,
      cookie: "1",
      sublogin: "Login",
      submit: "1",
    };

    const mal = {
      method: "POST",
      url: "http://myanimelist.net/login.php",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: options,
    };

    request(mal, (err, res, body) => {
      if (err) throw err;
    });

    res.redirect("/top/anime/1");
  });
});

/**
 * Returns the login page
 */

router.get("/login", (req, res) => {
  res.render("login");
});

// router.post("/login", passport.authenticate("local", {
//     successRedirect: "/top/anime/1",
//     failureRedirect: "/login"
// }), (req, res) => {});

/**
 * Returns the register page
 */

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username,
  });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      res.redirect("/top/anime/1");
    });
  });
});

/**
 * Logout route
 */

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/index");
});

module.exports = router;
