const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../../models/User');

router.get('/', (req, res, next) => {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var user = req.user.toObject();

    delete user['chatRooms'];
    delete user['blockedUsers'];
    delete user['connectedChatRoom'];
    delete user['socketID'];

    res.status(200).send({
      success: true,
      message: 'User Fetched',
      user: user
    });
  }
});

router.post('/search', (req, res, next) => {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var query = req.body.query;
    var userQuery = {
      _id: { $ne: null },
      $or: [
        { username: { $regex: '\\b' + query, $options: 'i' } },
        { name: { $regex: '\\b' + query, $options: 'i' } }
      ]
    };

    if (req.body.chatRoomID && req.body.chatRoomID.length > 0) {
      userQuery['chatRooms.data'] = req.body.chatRoomID;
    }

    User.find(userQuery, '-email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID')
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
    var userQuery = {};

    if (req.user.accountType === 'guest') {
      userQuery = {
        name: { $regex : new RegExp(req.body.name, "i") },
        accountType: 'guest',
        isOnline: true,
      };

    } else {
      userQuery = {
        username: username,
      };
    }

    User.findOne(userQuery)
      .then((user) => {
        if (
          (user !== null) &&
          (
            (req.user.accountType === 'guest') ||
            (user._id != userID)
          )
        ) {
          var message = '';

          if (req.user.accountType === 'guest') {
            message = 'Sorry! Guest name already taken';
          } else if (user._id != userID) {
            message = 'Username already exist';
          }
          res.status(401).send({
            success: false,
            message: message,
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
                { safe: true, upsert: true, new: true, select: '-chatRooms -connectedChatRoom -ipAddress -blockedUsers -socketID' }
              ).exec();
            })
            .then((user) => {
              res.status(200).send({
                success: true,
                message: 'Your profile is updated successfully',
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
