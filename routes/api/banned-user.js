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
    User.find({_id: {$ne: null}, ban: {data: true}}, '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID')
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
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var banUserID = req.body.banUserID;
    var banDuration = req.body.banDuration;

    var banEndDate = new Date();

    switch ( banDuration ) {
      case 'two_hours':
        banEndDate = new Date( +new Date() + 2 * 60 * 60 * 1000 );
        break;
      case 'two_days':
        banEndDate = new Date( +new Date() + 2 * 24 * 60 * 60 * 1000 );
        break;
      case 'one_week':
        banEndDate = new Date( +new Date() + 7 * 24 * 60 * 60 * 1000 );
        break;
      case 'three_months':
        banEndDate = new Date( +new Date() + 3 * 30 * 24 * 60 * 60 * 1000 );
        break;
      case 'lifetime':
        banEndDate = new Date( +new Date() + 10 * 12 * 30 * 24 * 60 * 60 * 1000 );
        break;
      default:
        break;
    }

    User.findByIdAndUpdate(
      banUserID,
      { $set: { ban: { data: true, endDate: banEndDate } } },
      { safe: true, upsert: true, new: true, select: '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID' }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'User Banned'
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
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var unbanUserID = req.body.unbanUserID;

    User.findByIdAndUpdate(
      unbanUserID,
      { $set: { ban: { data: false, endDate: new Date() } } },
      { new: true, upsert: true, select: '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ban -ipAddress -socketID' }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'User Unbanned'
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
