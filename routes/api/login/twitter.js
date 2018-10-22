var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var User = require('../../../models/User');
var ChatRoom = require('../../../models/ChatRoom');
var popupTools = require('popup-tools');

passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/api/login/twitter/callback',
  includeEmail: true
}, function(token, tokenSecret, profile, done) {
  var username = 'twitter/' + profile.id;
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
    profilePicture = profilePicture.replace('_normal', '_200x200');
  } else {
    profilePicture = '';
  }

  var userData = {
    username: username,
    name: name,
    email: email,
    profilePicture: profilePicture,
    accountType: 'twitter'
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
            return ChatRoom.find({_id: {$ne: null}, chatType: 'public'})
              .distinct('_id');
          })
          .then((publicChatRooms) => {
            var userID = userData._id;

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

router.get('/', passport.authenticate('twitter'));

router.get('/callback', passport.authenticate('twitter'), function(req, res) {
  res.send(popupTools.popupResponse({userData: req.user}));
});

module.exports = router;
