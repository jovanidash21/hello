var express = require('express');
var router = express.Router({mergeParams: true});
var User = require('../../models/User');
var ChatRoom = require('../../models/ChatRoom');

router.post('/', function(req, res, next) {
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.findById(userID, 'chatRooms')
      .populate({
        path: 'chatRooms.data',
        populate: {
          path: 'members'
        }
      })
      .exec()
      .then((user) => {
        var userChatRooms = user.chatRooms.filter(function(chatRoom) {
          return !chatRoom.kick.data && !chatRoom.trash.data;
        });

        for (var i = 0; i < userChatRooms.length; i++) {
          var chatRoom = userChatRooms[i].data;

          for (var j = 0; j < chatRoom.members.length; j++) {
            var member = chatRoom.members[j];

            if (chatRoom.chatType === 'private') {
              if (member._id == userID) {
                chatRoom.chatIcon = member.profilePicture;
              }
            } else if (chatRoom.chatType === 'direct') {
              if (member._id != userID) {
                chatRoom.name = member.name;
                chatRoom.chatIcon = member.profilePicture;
              }
            } else if ((chatRoom.chatType === 'group') || chatRoom.chatType === 'public') {
              chatRoom.members[j] = member._id;
            }
          }
        }
        res.status(200).send(userChatRooms);
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      });
  }
});

router.post('/create', function(req, res, next) {
  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var userID = req.body.userID;
    var name = req.body.name;
    var chatType = req.body.chatType;
    var members = req.body.members;
    var chatRoomData = {
      name,
      chatType,
      members
    };

    if ("chatIcon" in req.body) {
      chatRoomData.chatIcon = req.body.chatIcon;
    }

    if (chatType === 'private' || chatType === 'public') {
      res.status(401).send({
        success: false,
        message: 'Unauthorized'
      });
    } else if (chatType === 'direct' && members.length !== 2) {
      res.status(401).send({
        success: false,
        message: 'Please select 2 members.'
      });
    } else if (chatType === 'group' && (members.length < 3 || members.length > 5)) {
      res.status(401).send({
        success: false,
        message: 'Please select at least 3 and at most 5 members.'
      });
    } else {
      ChatRoom.findOne({members: {$all: members}, chatType: 'direct'}, function(err, chatRoom) {
        if (!err) {
          if (chatRoom !== null) {
            var chatRoomID = chatRoom._id;

            User.update(
              { _id: userID, 'chatRooms.data': chatRoomID },
              { $set: { 'chatRooms.$.trash.data': false, 'chatRooms.$.trash.endDate': new Date() } },
              { safe: true, upsert: true, new: true }
            )
            .then((user) => {
              ChatRoom.findById(chatRoomID)
                .populate('members')
                .exec()
                .then((chatRoomData) => {
                  res.status(200).send({
                    success: true,
                    message: 'Chat room already exist.',
                    chatRoom: {
                      data: chatRoomData,
                      unReadMessages: 0,
                      kick: {},
                      trash: {}
                    }
                  });
                })
                .catch((error) => {
                  res.status(500).send({
                    success: false,
                    message: 'Server Error!'
                  });
                });
            })
            .catch((error) => {
              res.status(500).send({
                success: false,
                message: 'Server Error!'
              });
            });
          } else {
            var chatRoom = new ChatRoom(chatRoomData);

            chatRoom.save()
              .then((chatRoomData) => {
                for (var i = 0; i < chatRoomData.members.length; i++) {
                  var chatRoomMember = chatRoomData.members[i];

                  User.findByIdAndUpdate(
                    chatRoomMember,
                    { $push: { chatRooms: { data: chatRoomData._id, unReadMessages: 0, kick: {}, trash: {} } } },
                    { safe: true, upsert: true, new: true }
                  ).exec();
                }

                return ChatRoom.findById(chatRoomData._id)
                  .populate('members');
              })
              .then((chatRoomData) => {
                res.status(200).send({
                  success: true,
                  message: 'Chat Room Created.',
                  chatRoom: {
                    data: chatRoomData,
                    unReadMessages: 0
                  }
                });
              })
              .catch((error) => {
                res.status(500).send({
                  success: false,
                  message: 'Server Error!'
                });
              });
          }
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      });
    }
  }
});

router.post('/trash', function(req, res, next) {
  var userID = req.body.userID;
  var chatRoomID = req.body.chatRoomID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    User.update(
      { _id: userID, 'chatRooms.data': chatRoomID },
      { $set: { 'chatRooms.$.trash.data': true, 'chatRooms.$.trash.endDate': new Date( +new Date() + 2 * 60 * 1000 ) } },
      { safe: true, upsert: true, new: true }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'Chat Room Trashed.'
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
