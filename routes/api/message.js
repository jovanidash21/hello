var express = require('express');
var router = express.Router({mergeParams: true});
var Message = require('../../models/Message');
var ChatRoom = require('../../models/ChatRoom');
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
    Message.find({chatRoom: chatRoomID})
      .populate('user')
      .sort('createdAt')
      .exec(function(err, chatRoomMessages) {
        if (!err) {
          for (var i = 0; i < chatRoomMessages.length; i++) {
            var message = chatRoomMessages[i];

            Message.findOneAndUpdate(
              { _id: message._id, readBy: { $ne: userID } },
              { $addToSet: { readBy: userID } },
              { safe: true, upsert: true, new: true },
              function(err) {
                if (!err) {
                  res.end();
                } else {
                  res.end(err);
                }
              }
            );
          }

          User.update(
            { _id: userID, 'chatRooms.data': chatRoomID },
            { $set: { 'chatRooms.$.unReadMessages': 0 } },
            { safe: true, upsert: true, new: true },
            function(err) {
              if (!err) {
                res.end();
              } else {
                res.end(err);
              }
            }
          );

          res.status(200).send(chatRoomMessages);
        } else {
          res.status(500).send({
            success: false,
            message: 'Server Error!'
          });
        }
      });
  }
});

router.post('/:chatRoomID/:userID', function(req, res, next) {
  var chatRoomID = req.params.chatRoomID;
  var userID = req.params.userID;

  if ((req.user === undefined) || (req.user._id != userID) || (req.user.accountType === 'guest')) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var messageData = {
      text: req.body.text,
      user: userID,
      chatRoom: chatRoomID
    };
    var message = new Message(messageData);

    message.save(function(err, messageData) {
      if (!err) {
        Message.findById(messageData._id)
          .populate('user')
          .exec(function(err, messageData) {
            if (!err) {
              ChatRoom.findById(chatRoomID)
                .exec(function(err, chatRoom) {
                  if (!err) {
                    for (var i = 0; i < chatRoom.members.length; i++) {
                      var memberID = chatRoom.members[i];

                      if (memberID != userID) {
                        User.update(
                          { _id: memberID, 'chatRooms.data': chatRoomID },
                          { $inc: { 'chatRooms.$.unReadMessages': 1 } },
                          { safe: true, upsert: true, new: true },
                          function(err) {
                            if (!err) {
                              res.end();
                            } else {
                              res.end(err);
                            }
                          }
                        );
                      } else {
                        continue;
                      }
                    }
                  } else {
                    res.status(500).send({
                      success: false,
                      message: 'Server Error!'
                    });
                  }
                });

              res.status(200).send({
                success: true,
                message: 'Message Sent.',
                messageData: messageData
              });
            } else {
              res.status(500).send({
                success: false,
                message: 'Server Error!'
              });
            }
          });
      } else {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      }
    });
  }
});

module.exports = router;
