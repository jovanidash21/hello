const express = require('express');
const router = express.Router({mergeParams: true});
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const User = require('../../../models/User');
const ChatRoom = require('../../../models/ChatRoom');
const popupTools = require('popup-tools');

passport.use(new Strategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: '/api/login/twitter/callback',
  includeEmail: true
}, (token, tokenSecret, profile, done) => {
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

  User.findOne({username: username}, (err, user) => {
    if (!err) {
      if (user !== null) {
        user.updateOne(userData, (err) => {
          if (!err) {
            return done(null, user);
          } else {
            return done(err);
          }
        });
      } else {
        userData.role = 'ordinary';
        userData.mute = {};
        userData.ban = {};
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

router.get('/callback', passport.authenticate('twitter'), (req, res) => {
  res.send(popupTools.popupResponse({
    data: {
      success: true,
      message: 'Login Successful',
      userData: req.user
    }
  }));
});

module.exports = router;
