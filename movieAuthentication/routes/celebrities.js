const Celebrity = require('../models/celebrity');
const express = require("express");
const router = express.Router();

router.get("/celebrities", (req, res, next) => {
  Celebrity
    .find()
    .then(celebrities => {
      res.render('celebrities/index', {celebrities})
    })
    .catch(err => console.log("There was an error returning the celebrities", err))
})

router.get("/celebrities/details/:id", (req, res, next) => {
  Celebrity
    .findById(req.params.id).populate('user')
    .then(celebrity => {
      res.render('celebrities/show', {celebrity})
    })
    .catch(err => console.log("There's was an error finding the celebrity", err))
})

router.get("/celebrities/new", (req, res, next) => {
  if(!req.user){
    req.flash('error', 'Login to create a new celebrity');
    res.redirect("/celebrities")
  }
  res.render('celebrities/new' )
})

router.post("/celebrities", (req, res, next) => {
  Celebrity
  .create({
    name: req.body.name,
    occupation: req.body.occupation,
    catchPhrase: req.body.catchPhrase,
    user: req.user._id
  })
  .then(newCelebrity => {
    res.redirect("/celebrities")})
  .catch(err => {
    res.render("celebrities/new")
    console.log("There was an error adding the celebrity to the DB", err)
  })
})

router.post("/celebrities/delete/:id", (req, res, next) => {
  Celebrity
  .findByIdAndDelete(req.params.id)
  .then(deltedCelebrity => {res.redirect("/celebrities")})
  .catch(err => console.log("There was an error deleting the celebrity", err))
})

router.get("/celebrities/edit/:id", (req, res, next) => {
  Celebrity
  .findById(req.params.id)
  .then(celebrity => {
    if(celebrity.user.equals(req.user._id)){
      res.render("celebrities/edit", celebrity)
    } else{
      res.redirect("/celebrities")
    }
  })
  .catch(err => console.log("There was an error finding the celebrity", err))
})

router.post("/celebrities/edit/:id", (req, res, next) => {
  Celebrity
    .findByIdAndUpdate(req.params.id, req.body)
    .then(editedCelebrity =>{res.redirect("/celebrities")} )
    .catch(err => console.log("Error while updating the celebrity:", err))
})

module.exports = router;