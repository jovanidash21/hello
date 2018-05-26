var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');

router.get('/', function(req, res, next) {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    res.status(200).json(req.user);
  }
});

router.get('/all', function(req, res, next) {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.find({}, function(err, users) {
      if (!err) {
        res.status(200).send(users);
      } else {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      }
    });
  }
});

router.post('/role', function(req, res, next) {
  var userID = req.body.userID;
  var role = req.body.role;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      userID,
      { $set: { role: role }},
      { safe: true, upsert: true, new: true },
      function(err) {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'User role updated.'
          });
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      }
    );
  }
});

router.post('/mute', function(req, res, next) {
  var userID = req.body.userID;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      userID,
      { $set: { isMute: true }},
      { safe: true, upsert: true, new: true },
      function(err) {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'User muted.'
          });
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      }
    );
  }
});

module.exports = router;
