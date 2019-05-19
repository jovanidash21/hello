var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var User = require('../../models/User');
var ChatRoom = require('../../models/ChatRoom');

router.post('/', (req, res, next) => {
  var userData = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    accountType: 'local',
    role: 'ordinary',
    mute: {},
    ban: {}
  };

  User.register(new User(userData), req.body.password, (err) => {
    if (!err) {
      passport.authenticate('local', (err, user) => {
        req.logIn(user, (err) => {
          if (!err ) {
            var userID = user._id;

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

                res.status(200).send({
                  success: true,
                  message: 'Login Successful',
                  userData: user
                });
              })
              .catch((error) => {
                res.status(500).send({
                  success: false,
                  message: 'Server Error!'
                });
              });
          } else {
            res.status(500).send({
              success: false,
              message: 'Server Error!'
            });
          }
        })
      })(req, res, next);
    } else {
      res.status(401).send({
        success: false,
        message: 'Sorry! Username already taken'
      });
    }
  });
});

module.exports = router;
