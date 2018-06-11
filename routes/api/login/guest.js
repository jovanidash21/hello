var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Strategy = require('passport-custom').Strategy;
var User = require('../../../models/User');
var ChatRoom = require('../../../models/ChatRoom');

passport.use(new Strategy(
  function(req, done) {
    User.findOne({username: req.body.username}, function (err, user) {
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
    accountType: 'guest'
  };

  User.findOne({name: req.body.name, accountType: 'guest'}, function(err, user) {
    if (!err) {
      if (user !== null) {
        res.status(401).send({
          success: false,
          message: 'Guest name already exist.'
        });
      } else {
        userData.role = 'ordinary';
        userData.block = {};
        userData.mute = {};
        var newUser = new User(userData);

        newUser.save(function(err) {
          if (!err) {
            passport.authenticate('custom', function(err, user) {
              req.logIn(user, function(err) {
                if (!err) {
                  var chatLoungeID = process.env.MONGODB_CHAT_LOUNGE_ID;
                  var userID = newUser._id;

                  if (chatLoungeID) {
                    ChatRoom.findByIdAndUpdate(
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

                    User.findByIdAndUpdate(
                      userID,
                      { $push: { chatRooms: { data: chatLoungeID, unReadMessages: 0 } } },
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
