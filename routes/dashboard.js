const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }

  if (req.user.isAdmin) {
    User.find()
      .then((users) => {
        res.render('adminDashboard', { users: users });
      })
      .catch((err) => {
        console.error(err);
        res.redirect('/dashboard');
      });
  } else {
    res.render('dashboard', { user: req.user });
  }
});

module.exports = router;
