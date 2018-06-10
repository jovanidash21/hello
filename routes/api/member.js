var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');

router.get('/:chatRoomID/:userID', function(req, res, next) {
  var chatRoomID = req.params.chatRoomID;
  var userID = req.params.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.find({
      chatRooms: {
        $elemMatch: {
          data: chatRoomID,
          isKick: false
        }
      },
      isOnline: true
    }, function(err, members) {
      if (!err) {
        res.status(200).send(members);
      } else {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      }
    });
  }
});

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
      { $set: { block: { data: true, endDate: new Date( +new Date() + 3 * 60 * 1000 ) } } },
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
    User.update(
      { _id: memberID, 'chatRooms.data': chatRoomID },
      { $set: { 'chatRooms.$.isKick': true, 'chatRooms.$.endDate': new Date( +new Date() + 3 * 60 * 1000 ) } },
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
      { $set: { mute: { data: true, endDate: new Date( +new Date() + 3 * 60 * 1000 ) } } },
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
