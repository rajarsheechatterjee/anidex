const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

/**
 * Returns the login page
 */

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/top/anime/1",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

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
