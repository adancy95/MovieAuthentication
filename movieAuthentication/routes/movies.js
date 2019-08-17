const Movie = require('../models/movie');
const express = require("express");
const router = express.Router();

router.get("/movies", (req, res, next) => {
  Movie
    .find()
    .then(movies => {
      console.log(movies)
      res.render('movies/index', {movies})
    })
    .catch(err => console.log("There was an error returning the celebrities", err))
})

router.get("/movies/details/:id", (req, res, next) => {
  Movie
    .findById(req.params.id).populate('user')
    .then(movie => {
      res.render('movies/show', {movie})
    })
    .catch(err => console.log("There's was an error finding the movie", err))
})

router.get("/movies/new", (req, res, next) => {
  if(!req.user){
    req.flash('error', 'Login to Add a Movie');
    res.redirect("/movies");
  }
  res.render('movies/new' )
})

router.post("/movies", (req, res, next) => {
  Movie
  .create({
    title: req.body.title,
    genre: req.body.genre,
    plot: req.body.plot,
    user: req.user._id})
  .then(newMovie => {
    res.redirect("/movies")})
  .catch(err => {
    res.render("movies/new")
    console.log("There was an error adding the movie to the DB", err)
  })
})

router.post("/movies/delete/:id", (req, res, next) => {
  Movie
  .findByIdAndDelete(req.params.id)
  .then(deltedMovie => {res.redirect("/movies")})
  .catch(err => console.log("There was an error deleting the movie", err))
})

router.get("/movies/edit/:id", (req, res, next) => {
  Movie
  .findById(req.params.id)
  .then(movie => {
    if(movie.user.equals(req.user._id)){
      res.render("movies/edit", movie)
    } else {
      res.redirect("/movies")
    }
  })
  .catch(err => console.log("There was an error finding the movie", err))
})

router.post("/movies/edit/:id", (req, res, next) => {
  Movie
    .findByIdAndUpdate(req.params.id, req.body)
    .then(editedMovie =>{res.redirect("/movies")} )
    .catch(err => console.log("Error while updating the movie:", err))
})

module.exports = router;