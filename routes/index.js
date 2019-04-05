const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require("path");
const fs = require('fs');
var NodeGeocoder = require('node-geocoder');

// NodeGeocoder Config
var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'AIzaSyBMFYX5JdYmfZbZZfVLZjPM5cTez1AlDeY', // for Mapquest, OpenCage, Google Premier
  formatter: 'JSON'         // 'gpx', 'string', ...
};
var geocoder = NodeGeocoder(options);

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

// CRUD habitants
router.get('/habitants', ensureAuthenticated, (req, res) =>
res.render('habitants')
);
router.post('/habitants', ensureAuthenticated, (req, res) =>
fs.readFile(__dirname + '/../views/js/db.json', (err, data) => {
  var habitants;
  if (err) throw err;
  habitants = JSON.parse(data);
  var i = habitants[0].id;
  while (habitants[i]) {
    i++;
  }
  var lat;
  var lng;
  geocoder.geocode(req.body.address, function(err, res) {
    lat = res[0].latitude.toString(10);
    lng = res[0].longitude.toString(10);
    var new_habitant = {
      id: i,
      name: req.body.name,
      address: req.body.address,
      position: {
        lat: lat,
        lng: lng
      },
      given: "0"
    };
    habitants.push(new_habitant);
    fs.writeFileSync(__dirname + '/../views/js/db.json', JSON.stringify(habitants));
  })
  res.redirect('/dashboard');
})
);

router.get('/habitants_list', ensureAuthenticated, (req, res) =>
fs.readFile(__dirname + '/../views/js/db.json', (err, data) => {
  if (err) throw err;
  var habitants = JSON.parse(data);
  res.render('habitants_list', {habitants: habitants})
})
);
module.exports = router;
