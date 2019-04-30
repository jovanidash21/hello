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
    User.findById(userID, 'chatRooms')
      .populate({
        path: 'chatRooms.data',
        populate: {
          path: 'members',
          select: 'name profilePicture'
        }
      })
      .exec()
      .then((user) => {
        var userChatRooms = user.chatRooms.filter((chatRoom) => {
          return !chatRoom.kick.data && !chatRoom.trash.data;
        });

        userChatRooms = userChatRooms.sort((a, b) => {
          return new Date(a.data.createdAt) - new Date(b.data.createdAt);
        });

        for (var i = 0; i < userChatRooms.length; i++) {
          var chatRoom = userChatRooms[i].data;

          for (var j = 0; j < chatRoom.members.length; j++) {
            var member = chatRoom.members[j];

            if (chatRoom.chatType === 'direct') {
              if (member._id != userID) {
                chatRoom.name = member.name;
                chatRoom.chatIcon = member.profilePicture;
              }
            } else if ((chatRoom.chatType === 'group') || chatRoom.chatType === 'public') {
              chatRoom.members[j] = member._id;
            }
          }
        }
        res.status(200).send({
          success: true,
          message: 'Chat Rooms Fetched',
          chatRooms: userChatRooms
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

router.post('/create', (req, res, next) => {
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
    var members = [];
    var chatRoomData = {
      name,
      chatType
    };

    if ("members" in req.body && chatType !== 'public') {
      members = req.body.members;
      chatRoomData.members = members;
    }
    if ("chatIcon" in req.body) {
      chatRoomData.chatIcon = req.body.chatIcon;
    }
    if (chatType === 'direct' && members.length !== 2) {
      res.status(401).send({
        success: false,
        message: 'Please select 2 members'
      });
    } else if (chatType === 'group' && (members.length < 3 || members.length > 5)) {
      res.status(401).send({
        success: false,
        message: 'Please select at least 3 and at most 5 members'
      });
    } else {
      ChatRoom.findOne({_id: {$ne: null}, members: {$all: members}, chatType: 'direct'}, (err, chatRoom) => {
        if (!err) {
          if (chatRoom !== null) {
            var chatRoomID = chatRoom._id;

            User.updateOne(
              { _id: userID, 'chatRooms.data': chatRoomID },
              { $set: { 'chatRooms.$.trash.data': false, 'chatRooms.$.trash.endDate': new Date() } },
              { safe: true, upsert: true, new: true }
            )
            .then((user) => {
              ChatRoom.findById(chatRoomID)
                .populate('members', '-username -email -chatRooms -connectedChatRoom -blockedUsers -block -mute -ipAddress -socketID')
                .exec()
                .then((chatRoomData) => {
                  res.status(200).send({
                    success: true,
                    message: 'Chat room already exist',
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
            User.find({_id: {$ne: null}})
              .distinct('_id')
              .then((userIDs) => {
                if (chatType === 'public') {
                  chatRoomData.members = userIDs;
                }

                var chatRoom = new ChatRoom(chatRoomData);

                return chatRoom.save();
              })
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
                  .populate('members', '-username -email -chatRooms -blockedUsers -block -mute -ipAddress -socketID');
              })
              .then((chatRoomData) => {
                res.status(200).send({
                  success: true,
                  message: 'Chat Room Created',
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

router.post('/clear-unread', (req, res, next) => {
  if (req.user === undefined) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var userID = req.body.userID;
    var chatRoomIDs = req.body.chatRoomIDs;

    User.findById(userID)
      .then((user) => {
        for (var i = 0; i < chatRoomIDs.length; i++) {
          var chatRoomID = chatRoomIDs[i];

          User.updateOne(
            { _id: userID, 'chatRooms.data': chatRoomID },
            { $set: { 'chatRooms.$.unReadMessages': 0 } },
            { safe: true, upsert: true, new: true }
          ).exec();
        }

        res.status(200).send({
          success: true,
          message: 'Chat Room Unread Messages Cleared',
          chatRoomIDs: chatRoomIDs
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

router.post('/trash', (req, res, next) => {
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var chatRoomID = req.body.chatRoomID;

    User.updateOne(
      { _id: userID, 'chatRooms.data': chatRoomID },
      { $set: { 'chatRooms.$.trash.data': true, 'chatRooms.$.trash.endDate': new Date( +new Date() + 2 * 60 * 1000 ) } },
      { safe: true, upsert: true, new: true }
    )
    .then((user) => {
      res.status(200).send({
        success: true,
        message: 'Chat Room Trashed'
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

router.post('/trash-all', (req, res, next) => {
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var chatRoomID = req.body.chatRoomID;

    User.findById(userID, 'chatRooms')
      .populate('chatRooms.data')
      .then((user) => {
        var userChatRooms = user.chatRooms;

        for (var i = 0; i < userChatRooms.length; i++) {
          var chatRoom = userChatRooms[i].data;

          if ( chatRoom.chatType === 'direct' ) {
            User.updateOne(
              { _id: userID, 'chatRooms.data': chatRoom._id },
              { $set: { 'chatRooms.$.trash.data': true, 'chatRooms.$.trash.endDate': new Date( +new Date() + 2 * 60 * 1000 ) } },
              { safe: true, upsert: true, new: true }
            ).exec();
          }
        }

        res.status(200).send({
          success: true,
          message: 'Chat Rooms Trashed'
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
