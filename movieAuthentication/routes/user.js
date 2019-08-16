const User = require("../models/user");

const express = require('express');
const router  = express.Router();

const bcrypt = require("bcrypt");



router.get('/signup', (req, res, next) => {
  res.render('users/signup');
})

router.post('/createaccount', (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(req.body.password, salt)

  User.create({
    username: req.body.username,
    password = hashPass
  })
  .then(() => res.redirect('/celebrities'))
  .catch( err => {next(err)})
})