var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');
var ChatRoom = require('../../models/ChatRoom');

router.get('/:chatRoomID/:userID', function(req, res, next) {
  var chatRoomID = req.params.chatRoomID;
  var userID = req.params.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    ChatRoom.findById(chatRoomID)
      .populate('members')
      .exec(function(err, chatRoomData) {
        if (!err) {
          res.status(200).send(chatRoomData.members);
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      });
  }
});

/*
router.post('/block', function(req, res, next) {
  var memberID = req.body.memberID;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      memberID,
      { $set: { isBlock: true, isOnline: false, socketID: '' }},
      { safe: true, upsert: true, new: true },
      function(err, user) {
        if (!err) {

        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      }
    );
  }
});
*/

router.post('/kick', function(req, res, next) {
  var chatRoomID = req.body.chatRoomID;
  var memberID = req.body.memberID;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      memberID,
      { $pull: { chatRooms: chatRoomID }},
      { safe: true, upsert: true, new: true },
      function(err, user) {
        if (!err) {
          ChatRoom.findByIdAndUpdate(
            chatRoomID,
            { $pull: { members: memberID }},
            { safe: true, upsert: true, new: true },
            function(err) {
              if (!err) {
                res.status(200).send({
                  success: true,
                  message: 'User kick out of the chat room.'
                });
              } else {
                res.status(500).send({
                  success: false,
                  message: 'Server Error!'
                });
              }
            }
          );
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      }
    );
  }
});

router.post('/role', function(req, res, next) {
  var memberID = req.body.memberID;
  var role = req.body.role;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      memberID,
      { $set: { role: role }},
      { safe: true, upsert: true, new: true },
      function(err) {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'User role updated.'
          });
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      }
    );
  }
});

router.post('/mute', function(req, res, next) {
  var memberID = req.body.memberID;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      memberID,
      { $set: { isMute: true }},
      { safe: true, upsert: true, new: true },
      function(err) {
        if (!err) {
          res.status(200).send({
            success: true,
            message: 'User muted.'
          });
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      }
    );
  }
});

module.exports = router;
