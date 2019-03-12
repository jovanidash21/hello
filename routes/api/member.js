var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');
var ChatRoom = require('../../models/ChatRoom');

router.post('/', (req, res, next) => {
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var chatRoomID = req.body.chatRoomID;
    var userRole = '';

    User.findById(userID)
      .then((user) => {
        userRole = user.role;

        return ChatRoom.findById(chatRoomID);
      })
      .then((chatRoom) => {
        var findParams = {
          chatRooms: {
            $elemMatch: {
              data: chatRoomID,
              'kick.data': false
            }
          },
          isOnline: true
        };
        var findExclude = '-chatRooms -socketID';

        if (chatRoom.chatType === 'public') {
          findParams.connectedChatRoom = chatRoomID;
        }

        if (
          userRole.length > 0 &&
          userRole !== 'admin' &&
          userRole !=='owner'
        ) {
          findExclude = findExclude + ' -ipAddress';
        }

        return User.find(findParams, findExclude);
      })
      .then((members) => {
        res.status(200).send({
          success: true,
          message: 'Members Fetched',
          members: members
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

router.post('/block', (req, res, next) => {
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var memberID = req.body.memberID;

    User.findByIdAndUpdate(
      memberID,
      { $set: { block: { data: true, endDate: new Date( +new Date() + 3 * 60 * 1000 ) } } },
      { safe: true, upsert: true, new: true }
    )
    .then((user) => {

    })
    .catch((error) => {
      res.status(500).send({
        success: false,
        message: 'Server Error!'
      });
    });
  }
});

router.post('/kick', (req, res, next) => {
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var chatRoomID = req.body.chatRoomID;
    var memberID = req.body.memberID;

    User.updateOne(
      { _id: memberID, 'chatRooms.data': chatRoomID },
      { $set: { 'chatRooms.$.kick.data': true, 'chatRooms.$.kick.endDate': new Date( +new Date() + 30 * 60 * 1000 ) } },
      { safe: true, upsert: true, new: true }
    )
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'User kick out of the chat room'
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

router.post('/role', (req, res, next) => {
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var memberID = req.body.memberID;
    var role = req.body.role;

    User.findByIdAndUpdate(
      memberID,
      { $set: { role: role }},
      { safe: true, upsert: true, new: true }
    )
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'User role updated'
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

router.post('/mute', (req, res, next) => {
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var memberID = req.body.memberID;

    User.findByIdAndUpdate(
      memberID,
      { $set: { mute: { data: true, endDate: new Date( +new Date() + 3 * 60 * 1000 ) } } },
      { safe: true, upsert: true, new: true }
    )
    .then(() => {
      res.status(200).send({
        success: true,
        message: 'User muted'
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
