const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require("path");
const fs = require('fs');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
res.render('dashboard', {
  user: req.user
})
);

// Map
router.get('/map', ensureAuthenticated, (req, res) =>
res.render('map')
);
router.post('/map', function(req, res) {
  if (req.body.given) {
    fs.readFile(__dirname + '/../views/js/db.json', (err, data) => {
      var habitants;
      if (err) throw err;
      habitants = JSON.parse(data);
      var i = parseInt(req.body.i, 10)
      habitants[i].given = req.body.given;
      fs.writeFileSync(__dirname + '/../views/js/db.json', JSON.stringify(habitants));
      if (req.body.given > 0) {
        req.user.money += parseInt(req.body.given, 10);
        req.user.save(function(err) {
          if (err) return (err)
          req.login(req.user, function(err) {
            if (err) return (err)
          })
        })
      }
      res.redirect('/dashboard');
    });
  } else {
    // Erreur
  }
});

module.exports = router;
