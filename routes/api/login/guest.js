const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const Strategy = require('passport-custom').Strategy;
const User = require('../../../models/User');
const ChatRoom = require('../../../models/ChatRoom');

passport.use(new Strategy(
  (req, done) => {
    User.findOne({
      username: req.body.username,
      name: req.body.name,
      accountType: 'guest'
    })
    .then((user) => {
      return done(null, user);
    })
    .catch((error) => {
      return done(err);
    });
  }
));

router.post('/', (req, res, next) => {
  var userData = {
    username: req.body.username,
    name: req.body.name,
    gender: req.body.gender,
    accountType: 'guest'
  };

  User.findOne({name: { $regex : new RegExp(req.body.name, "i") }, accountType: 'guest', isOnline: true}, (err, user) => {
    if (!err) {
      if (user !== null) {
        res.status(401).send({
          success: false,
          message: 'Sorry! Guest name already taken'
        });
      } else {
        userData.role = 'ordinary';
        userData.mute = {};
        userData.ban = {};
        var newUser = new User(userData);

        newUser.save((err) => {
          if (!err) {
            passport.authenticate('custom', (err, user) => {
              req.logIn(user, (err) => {
                if (!err) {
                  var userID = newUser._id;

                  ChatRoom.find({_id: {$ne: null}, chatType: 'public'})
                    .distinct('_id')
                    .then((publicChatRooms) => {
                      for (var i = 0; i < publicChatRooms.length; i++) {
                        var publicChatRoomID = publicChatRooms[i];

                        ChatRoom.findByIdAndUpdate(
                          publicChatRoomID,
                          { $push: { members: userID }},
                          { safe: true, upsert: true, new: true }
                        ).exec();

                        User.findByIdAndUpdate(
                          userID,
                          { $push: { chatRooms: { data: publicChatRoomID, kick: {}, trash: {} } } },
                          { safe: true, upsert: true, new: true }
                        ).exec();
                      }

                      res.end();
                    })
                    .catch((error) => {
                      res.end(error);
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
