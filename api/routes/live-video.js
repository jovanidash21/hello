var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../models/User');

router.post('/', (req, res, next) => {
  var userID = req.body.userID;
  var start = req.body.start;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findByIdAndUpdate(
      userID,
      { $set: { isLiveVideoActive: start } },
      { safe: true, upsert: true, new: true }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'Live Video ' + (start ? 'started' : 'closed'),
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
