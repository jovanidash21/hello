const express = require('express');
const router = express.Router({mergeParams: true});
const Message = require('../../models/Message');
const ChatRoom = require('../../models/ChatRoom');
const User = require('../../models/User');
const multer = require('multer');
const slash = require('slash');

var fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/file/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

var imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/image/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

var audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/audio/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname + '.webm');
  }
});

var fileUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

var imageFilter = (req, file, cb) => {
  if ( file.mimetype.indexOf('image/') > -1 ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

var audioFilter = (req, file, cb) => {
  if ( file.mimetype === 'audio/webm' ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var audioUpload = multer({
  storage: audioStorage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 1024 * 1024 * 10
  }
});

router.post('/', (req, res, next) => {
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var chatRoomID = req.body.chatRoomID;
    var blockedUsers = [];

    User.find({'chatRooms.data': chatRoomID, blockedUsers: {$eq: userID}})
      .distinct('_id')
      .then((userIDs) => {
        blockedUsers = userIDs;

        return User.findById(userID, 'blockedUsers');
      })
      .then((user) => {
        return Message.find({
          $and: [
            { user: { $nin: user.blockedUsers } },
            { user: { $nin: blockedUsers } }
          ], chatRoom: chatRoomID})
          .sort({createdAt: 'descending'})
          .limit(20)
          .populate('user', '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ipAddress -socketID')
          .lean()
          .exec();
      })
      .then((messages) => {
        var chatRoomMessages = messages.reverse();

        for (var i = 0; i < messages.length; i++) {
          messages[i].user.blocked = false;
        }

        User.updateOne(
          { _id: userID, 'chatRooms.data': chatRoomID },
          { $set: { 'chatRooms.$.unReadMessages': 0 } },
          { safe: true, upsert: true, new: true }
        ).exec();

        res.status(200).send({
          success: true,
          message: 'Messages Fetched',
          messages: chatRoomMessages
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

router.post('/text', (req, res, next) => {
  var chatRoomID = req.body.chatRoomID;
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var messageData = {
      text: req.body.text,
      user: userID,
      chatRoom: chatRoomID,
      messageType: 'text',
      textColor: req.body.textColor
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findByIdAndUpdate(chatRoomID,
          { $set: { latestMessageDate: messageData.createdAt } },
          { safe: true, upsert: true, new: true }
        ).exec();
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.updateOne(
              { _id: memberID, 'chatRooms.data': chatRoomID },
              { $inc: { 'chatRooms.$.unReadMessages': 1 } },
              { safe: true, upsert: true, new: true }
            ).exec();
          } else {
            continue;
          }
        }

        return Message.find({chatRoom: chatRoomID})
          .sort({createdAt: 'descending'})
          .skip(50)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user', '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ipAddress -socketID');
      })
      .then((messageData) => {
        res.status(200).send({
          success: true,
          message: 'Message Sent',
          messageData: messageData
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

router.post('/file', fileUpload.single('file'), (req, res, next) => {
  var chatRoomID = req.body.chatRoomID;
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var messageType = 'file';
    var fileLink = slash(req.protocol + '://' + req.get('host') + '/' + req.file.path);

    if ( req.file.mimetype.indexOf('image/') > -1 ) {
      messageType = 'image';
    }

    var messageData = {
      text: req.file.originalname,
      user: userID,
      chatRoom: chatRoomID,
      messageType: messageType,
      fileLink: fileLink
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findByIdAndUpdate(chatRoomID,
          { $set: { latestMessageDate: messageData.createdAt } },
          { safe: true, upsert: true, new: true }
        ).exec();
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.updateOne(
              { _id: memberID, 'chatRooms.data': chatRoomID },
              { $inc: { 'chatRooms.$.unReadMessages': 1 } },
              { safe: true, upsert: true, new: true }
            ).exec();
          } else {
            continue;
          }
        }

        return Message.find({chatRoom: chatRoomID})
          .sort({createdAt: 'descending'})
          .skip(50)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user', '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ipAddress -socketID');
      })
      .then((messageData) => {
        res.status(200).send({
          success: true,
          message: 'Message Sent',
          messageData: messageData
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

router.post('/image', imageUpload.single('image'), (req, res, next) => {
  var chatRoomID = req.body.chatRoomID;
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var fileLink = slash(req.protocol + '://' + req.get('host') + '/' + req.file.path);
    var messageData = {
      text: req.file.originalname,
      user: userID,
      chatRoom: chatRoomID,
      messageType: 'image',
      fileLink: fileLink
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findByIdAndUpdate(chatRoomID,
          { $set: { latestMessageDate: messageData.createdAt } },
          { safe: true, upsert: true, new: true }
        ).exec();
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.updateOne(
              { _id: memberID, 'chatRooms.data': chatRoomID },
              { $inc: { 'chatRooms.$.unReadMessages': 1 } },
              { safe: true, upsert: true, new: true }
            ).exec();
          } else {
            continue;
          }
        }

        return Message.find({chatRoom: chatRoomID})
          .sort({createdAt: 'descending'})
          .skip(50)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user', '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ipAddress -socketID');
      })
      .then((messageData) => {
        res.status(200).send({
          success: true,
          message: 'Message Sent',
          messageData: messageData
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

router.post('/audio', audioUpload.single('audio'), (req, res, next) => {
  var chatRoomID = req.body.chatRoomID;
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    var fileLink = slash(req.protocol + '://' + req.get('host') + '/' + req.file.path);
    var messageData = {
      text: req.file.originalname,
      user: userID,
      chatRoom: chatRoomID,
      messageType: 'audio',
      fileLink: fileLink
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findByIdAndUpdate(chatRoomID,
          { $set: { latestMessageDate: messageData.createdAt } },
          { safe: true, upsert: true, new: true }
        ).exec();
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.updateOne(
              { _id: memberID, 'chatRooms.data': chatRoomID },
              { $inc: { 'chatRooms.$.unReadMessages': 1 } },
              { safe: true, upsert: true, new: true }
            ).exec();
          } else {
            continue;
          }
        }

        return Message.find({chatRoom: chatRoomID})
          .sort({createdAt: 'descending'})
          .skip(50)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user', '-username -email -chatRooms -connectedChatRoom -blockedUsers -mute -ipAddress -socketID');
      })
      .then((messageData) => {
        res.status(200).send({
          success: true,
          message: 'Message Sent',
          messageData: messageData
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

router.post('/delete', (req, res, next) => {
  var messageID = req.body.messageID;
  var chatRoomID = req.body.chatRoomID;

  if (
    req.user === undefined &&
    (req.user.role !== 'owner' || req.user.role !== 'admin' || req.user.role !== 'moderator')
  ) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    Message.deleteOne({_id: messageID, chatRoom: chatRoomID})
      .exec()
      .then(() => {
        res.status(200).send({
          success: true,
          message: 'Message Deleted'
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
