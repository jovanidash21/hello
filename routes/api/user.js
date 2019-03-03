var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');

router.get('/', (req, res, next) => {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    res.status(200).send({
      success: true,
      message: 'User Fetched',
      user: req.user
    });
  }
});

router.post('/search', (req, res, next) => {
  var query = req.body.query;

  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.find({_id: {$ne: null}, name: {$regex: '\\b' + query, $options: 'i'}})
      .then((users) => {
        res.status(200).send({
          success: true,
          message: 'Users Fetched',
          users: users
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      });
  }
});

router.get('/all', (req, res, next) => {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.find({_id: {$ne: null}})
      .then((users) => {
        res.status(200).send({
          success: true,
          message: 'Users Fetched',
          users: users
        });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      });
  }
});

router.post('/edit-profile', (req, res, next) => {
  var userID = req.body.userID;

  if (
    req.user === undefined ||
    req.user._id != userID ||
    ( req.user.accountType !== 'local' &&
    req.user.accountType !== 'guest')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var username = req.body.username;
    var userData = {
      name: req.body.name,
      gender: req.body.gender
    };

    User.findOne({username: username})
      .then((user) => {
        if (user != null && user._id != userID) {
          res.status(401).send({
            success: false,
            message: 'Username already exist'
          });
        } else {
          User.findById(userID)
            .then((user) => {
              if ( user.accountType === 'local' ) {
                userData.username = username;
                userData.email = req.body.email;
                userData.profilePicture = req.body.profilePicture;
              }

              return User.findByIdAndUpdate(
                userID,
                { $set: userData },
                { safe: true, upsert: true, new: true }
              ).exec();
            })
            .then((user) => {
              res.status(200).send({
                success: true,
                message: 'User Edited',
                user: user
              });
            })
            .catch((error) => {
              res.status(500).send({
                success: false,
                message: 'Server Error!'
              });
            });
        }
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      });
  }
});

module.exports = router;
