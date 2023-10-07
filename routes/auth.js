const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Login route
router.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// Logout route
router.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect('/login'); // Redirect to the login page after logout
    });
});

// Registration route
router.get('/register', (req, res) => {
  res.render('register', { message: req.flash('error') });
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        req.flash('error', 'Username is already taken.');
        return res.redirect('/register');
      }

      const newUser = new User({ username, password });

      newUser.save()
        .then(() => {
          req.flash('success', 'Registration successful. You can now login.');
          res.redirect('/login');
        })
        .catch((err) => {
          console.error(err);
          req.flash('error', 'Registration failed. Please try again.');
          res.redirect('/register');
        });
    })
    .catch((err) => {
      console.error(err);
      req.flash('error', 'Registration failed. Please try again.');
      res.redirect('/register');
    });
});

module.exports = router;
