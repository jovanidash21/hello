var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var User = require('../../../models/User');
var ChatRoom = require('../../../models/ChatRoom');
var popupTools = require('popup-tools');

passport.use(new Strategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/api/login/facebook/callback',
  profileFields: ['id', 'displayName', 'emails', 'picture.type(large)']
}, function(accessToken, refreshToken, profile, done) {
  var username = 'facebook/' + profile.id;
  var name = profile.displayName;
  var email;
  var profilePicture;

  if (profile.emails !== undefined) {
    email = profile.emails[0].value;
  } else {
    email = '';
  }

  if (profile.photos !== undefined) {
    profilePicture = profile.photos[0].value;
  } else {
    profilePicture = '';
  }

  var userData = {
    username: username,
    name: name,
    email: email,
    profilePicture: profilePicture,
    accountType: 'facebook'
  }

  User.findOne({username: username}, function(err, user) {
    if (!err) {
      if (user !== null) {
        user.update(userData, function(err) {
          if (!err) {
            return done(null, user);
          } else {
            return done(err);
          }
        });
      } else {
        userData.role = 'ordinary';
        userData.block = {};
        userData.mute = {};
        var newUser = new User(userData);

        newUser.save(function(err) {
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
                    done();
                  } else {
                    done(err);
                  }
                }
              );

              User.findByIdAndUpdate(
                userID,
                { $push: {
                  chatRooms: {
                    data: chatLoungeID,
                    unReadMessages: 0,
                    kick: {},
                    trash: {}
                  }
                } },
                { safe: true, upsert: true, new: true },
                function(err) {
                  if (!err) {
                    done();
                  } else {
                    done(err);
                  }
                }
              );
            }

            var chatRoomData = {
              name: newUser.name,
              chatIcon: '',
              members: [userID],
              chatType: 'private'
            };
            var chatRoom = new ChatRoom(chatRoomData);

            chatRoom.save(function(err, chatRoomData) {
              if (!err) {
                var chatRoomID = chatRoom._id;

                User.findByIdAndUpdate(
                  userID,
                  { $push: {
                    chatRooms: {
                      data: chatRoomID,
                      unReadMessages: 0,
                      kick: {},
                      trash: {}
                    }
                  } },
                  { safe: true, upsert: true, new: true },
                  function(err) {
                    if (!err) {
                      done();
                    } else {
                      done(err);
                    }
                  }
                );
              } else {
                done(err);
              }
            });

            return done(null, newUser);
          } else {
            return done(err);
          }
        });
      }
    } else {
      return done(err);
    }
  });
}));

router.get('/', passport.authenticate('facebook', {
  scope : ['email']
}));

router.get('/callback', passport.authenticate('facebook'), function(req, res) {
  res.send(popupTools.popupResponse({userData: req.user}));
});

module.exports = router;
