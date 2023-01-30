const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var path = require("path");
const fs = require('fs');
var NodeGeocoder = require('node-geocoder');
const Habitant = require('../models/habitant');

// NodeGeocoder Config
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 'AIzaSyBMFYX5JdYmfZbZZfVLZjPM5cTez1AlDeY',
  formatter: 'JSON'
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
Habitant.find({}, function(err, habitants) {
  var habitants_list = [];
  habitants.forEach(function(habitant) {
    habitants_list.push(habitant);
  });
  fs.readFile(__dirname + '/../views/js/habitants.json', (err, data) => {
    var habitants;
    if (err) throw err;
    habitants = habitants_list;
    fs.writeFileSync(__dirname + '/../views/js/habitants.json', JSON.stringify(habitants));
    res.render('map', { habitants: habitants_list })
  });
})
);
router.post('/map', ensureAuthenticated, function(req, res) {
  Habitant.findOneAndUpdate({_id : req.body.i}, {given : req.body.given}, function(err) {
    if (err) return (err)
  })
  if (req.body.given > 0) {
    req.user.money += parseInt(req.body.given, 10);
    req.user.save(function(err) {
      if (err) return (err)
      req.login(req.user, function(err) {
        if (err) return (err)
        res.redirect('/map');
      })
    })
  } else {
    res.redirect('/map');
  }
});

// CRUD habitants
router.get('/habitants', ensureAuthenticated, (req, res) =>
res.render('habitants')
);
router.post('/habitants', ensureAuthenticated, function(req, res) {
  geocoder.geocode(req.body.address, function(err, res) {
    var new_habitant = new Habitant({
      name: req.body.name,
      address : req.body.address,
      position : [res[0].latitude, res[0].longitude],
      given : "0"
    });
    console.log(new_habitant);
    new_habitant.save(function handleError(err) {
      if (err) return (err);
      res.redirect('/map')
    });
  });
});

router.get('/habitants_list', ensureAuthenticated, (req, res) =>
Habitant.find({}, function(err, habitants) {
  res.render('habitants_list', { habitants : habitants })
})
);
router.post('/deleteHabitant', ensureAuthenticated, (req, res) =>
Habitant.deleteOne({ name: req.body.name }, function(err) {
  if (err) return (err)
  res.redirect('/habitants_list')
})
);

module.exports = router;
