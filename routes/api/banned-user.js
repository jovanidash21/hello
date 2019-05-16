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
      .populate('blockedUsers', '-username -email -chatRooms -connectedChatRoom -blockedUsers -block -mute -ban -ipAddress -socketID')
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

module.exports = router;
