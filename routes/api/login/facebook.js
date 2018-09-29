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

        newUser.save()
          .then((userData) => {
            var userID = userData._id;
            var chatRoomData = {
              name: newUser.name,
              chatIcon: '',
              members: [userID],
              chatType: 'private'
            };
            var chatRoom = new ChatRoom(chatRoomData);

            return chatRoom.save();
          })
          .then((chatRoomData) => {
            var chatRoomID = chatRoomData._id;

            User.findByIdAndUpdate(
              newUser._id,
              { $push: { chatRooms: { data: chatRoomID, unReadMessages: 0, kick: {}, trash: {} } } },
              { safe: true, upsert: true, new: true }
            ).exec();

            return ChatRoom.find({_id: {$ne: null}, chatType: 'public'})
              .distinct('_id');
          })
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
                { $push: { chatRooms: { data: publicChatRoomID, unReadMessages: 0, kick: {}, trash: {} } } },
                { safe: true, upsert: true, new: true }
              ).exec();
            }

            return done(null, newUser);
          })
          .catch((error) => {
            return done(err);
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
