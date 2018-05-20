var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Strategy = require('passport-custom').Strategy;
var usersData = require('../../../models/users-data-schema');
var chatRoomsData = require('../../../models/chat-rooms-data-schema');

passport.use(new Strategy(
  function(req, done) {
    usersData.findOne({username: req.body.username}, function (err, user) {
      if (!err) {
        return done(null, user);
      } else {
        return done(err);
      }
    });
  }
));

router.post('/', function(req, res, next) {
  var userData = {
    username: req.body.username,
    name: req.body.name,
    gender: req.body.gender,
    role: 'guest'
  };

  usersData.findOne({username: req.body.username}, function(err, user) {
    if (!err) {
      if (user !== null) {
        res.status(401).send({
          success: false,
          message: 'Username already exist.'
        });
      } else {
        var newUser = new usersData(userData);

        newUser.save(function(err) {
          if (!err) {
            passport.authenticate('custom', function(err, user) {
              req.logIn(user, function(err) {
                if (!err) {
                  var chatLoungeID = process.env.MONGODB_CHAT_LOUNGE_ID;
                  var userID = newUser._id;

                  if (chatLoungeID) {
                    chatRoomsData.findByIdAndUpdate(
                      chatLoungeID,
                      { $push: { members: userID }},
                      { safe: true, upsert: true, new: true },
                      function(err) {
                        if (!err) {
                          res.end();
                        } else {
                          res.end(err);
                        }
                      }
                    );

                    usersData.findByIdAndUpdate(
                      userID,
                      { $push: { chatRooms: chatLoungeID }},
                      { safe: true, upsert: true, new: true },
                      function(err) {
                        if (!err) {
                          res.end();
                        } else {
                          res.end(err);
                        }
                      }
                    );
                  }

                  res.status(200).send({
                    success: true,
                    message: 'Login Successful.',
                    userData: user
                  });
                } else {
                  res.end(err);
                }
              });
            })(req, res, next);
          } else {
            res.status(500).send({
              success: false,
              message: 'Server Error!'
            });
          }
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: 'Server Error!'
      });
    }
  });
});

module.exports = router;
