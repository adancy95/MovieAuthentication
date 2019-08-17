const User = require("../models/user");
const Movie = require("../models/movie");
const Celebrity = require("../models/celebrity");

const express = require('express');
const router  = express.Router();

const bcrypt = require("bcryptjs");

const passport = require("passport");

const async = require('async');



router.get('/signup', (req, res, next) => {
  res.render('users/signup');
})

router.post('/createaccount', (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(req.body.password, salt)

  User.create({
    username: req.body.username,
    password: hashPass
  })
  .then(() => res.redirect('/celebrities'))
  .catch( err => {next(err)})
})

router.get('/login', (req, res, next)=>{

  res.render('users/login')
})


router.post("/login", passport.authenticate("local", {
  successRedirect: "/movies",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

  
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});



router.get('/userprofile', (req, res, next)=>{

  User.findById(req.user._id)
  .then( user => {
    Movie.find({user: req.user._id })
    .then( movies => {
      Celebrity.find({user: req.user._id })
      .then(celebrities => {
        res.render("users/userProfile", {user, movies, celebrities} )
      })
      .catch(err => {next(err)})
    })
    .catch(err => {next(err)})   
  })
  .catch( err => {next(err)}) 
 
})




module.exports = router;