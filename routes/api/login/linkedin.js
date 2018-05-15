var express = require('express');
var router = express.Router({mergeParams: true});
var passport = require('passport');
var Strategy = require('passport-linkedin-oauth2').Strategy;
var usersData = require('../../../models/users-data-schema');
var chatRoomsData = require('../../../models/chat-rooms-data-schema');
var popupTools = require('popup-tools');

passport.use(new Strategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: '/api/login/linkedin/callback',
  scope: ['r_emailaddress', 'r_basicprofile'],
  state: true
}, function(accessToken, refreshToken, profile, done) {
  var username = 'linkedin/' + profile.id;
  var name = profile.displayName;
  var email;
  var profilePicture;

  if (profile.emails !== undefined) {
    email = profile.emails[0].value;
  } else {
    email = '';
  }

  if (profile._json.pictureUrls.values !== undefined) {
    profilePicture = profile._json.pictureUrls.values[0];
  } else {
    profilePicture = '';
  }

  var userData = {
    username: username,
    name: name,
    email: email,
    profilePicture: profilePicture
  }

  usersData.findOne({username: username}, function(err, user) {
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
        var newUser = new usersData(userData);

        newUser.save(function(err) {
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
                    done();
                  } else {
                    done(err);
                  }
                }
              );

              usersData.findByIdAndUpdate(
                userID,
                { $push: { chatRooms: chatLoungeID }},
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


router.get('/', passport.authenticate('linkedin'));

router.get('/callback', passport.authenticate('linkedin'), function(req, res) {
  res.send(popupTools.popupResponse({userData: req.user}));
});

module.exports = router;
