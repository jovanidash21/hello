var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');

router.post('/', (req, res, next) => {
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.find({_id: {$ne: null}, ban: {data: true}})
      .populate('blockedUsers', '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID')
      .lean()
      .exec()
      .then((users) => {
        res.status(200).send({
          success: true,
          message: 'Banned Users Fetched',
          bannedUsers: users
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

router.post('/ban', (req, res, next) => {
  var userID = req.body.userID;

  if (req.user === undefined || req.user._id != userID) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var blockUserID = req.body.blockUserID;

    User.findByIdAndUpdate(
      userID,
      { $set: { ban: { data: true, endDate: new Date( +new Date() + 3 * 60 * 1000 ) } } },
      { safe: true, upsert: true, new: true, select: '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID' }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'User Blocked'
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

router.post('/unban', (req, res, next) => {
  var userID = req.body.userID;

  if (req.user === undefined || req.user._id != userID) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var unblockUserID = req.body.unblockUserID;

    User.findByIdAndUpdate(
      userID,
      { $set: { ban: { data: false, endDate: new Date() } } },
      { new: true, upsert: true, select: '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID' }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'User Unblocked'
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

router.post('/unban-all', (req, res, next) => {
  var userID = req.body.userID;

  if (req.user === undefined || req.user._id != userID) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      userID,
      { $set: { blockedUsers: [] }},
      { new: true, upsert: true, select: '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID' }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'All Users Unblocked'
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

module.exports = router;
