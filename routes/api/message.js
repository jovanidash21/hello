var express = require('express');
var router = express.Router({mergeParams: true});
var Message = require('../../models/Message');
var ChatRoom = require('../../models/ChatRoom');
var User = require('../../models/User');
var multer = require('multer');
var slash = require('slash');

var fileImageStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

var audioStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/audio/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname + '.webm');
  }
});

var fileUpload = multer({
  storage: fileImageStorage,
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
  storage: fileImageStorage,
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

router.post('/', function(req, res, next) {
  var chatRoomID = req.body.chatRoomID;
  var userID = req.body.userID;

  if ((req.user === undefined) || (req.user._id != userID)) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized'
    });
  } else {
    Message.find(
      {
        chatRoom: chatRoomID,
        readBy: {
          $ne: userID
        }
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];

          Message.findByIdAndUpdate(
            message._id,
            { $addToSet: { readBy: userID } },
            { safe: true, upsert: true, new: true }
          ).exec();
        }

        return Message.find({chatRoom: chatRoomID})
          .sort({createdAt: 'descending'})
          .populate('user');
      })
      .then((messages) => {
        var chatRoomMessages = messages.reverse();

        User.update(
          { _id: userID, 'chatRooms.data': chatRoomID },
          { $set: { 'chatRooms.$.unReadMessages': 0 } },
          { safe: true, upsert: true, new: true }
        ).exec();

        res.status(200).send(chatRoomMessages);
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: 'Server Error!'
        });
      });
  }
});

router.post('/text', function(req, res, next) {
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
      readBy: [userID],
      messageType: 'text'
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findById(chatRoomID);
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.update(
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
          .skip(20)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user');
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

router.post('/file', fileUpload.single('file'), function(req, res, next) {
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
      readBy: [userID],
      messageType: messageType,
      fileLink: fileLink
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findById(chatRoomID);
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.update(
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
          .skip(20)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user');
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

router.post('/image', imageUpload.single('image'), function(req, res, next) {
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
      readBy: [userID],
      messageType: 'image',
      fileLink: fileLink
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findById(chatRoomID);
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.update(
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
          .skip(20)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user');
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

router.post('/audio', audioUpload.single('audio'), function(req, res, next) {
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
      readBy: [userID],
      messageType: 'audio',
      fileLink: fileLink
    };
    var message = new Message(messageData);

    message.save()
      .then((messageData) => {
        return ChatRoom.findById(chatRoomID);
      })
      .then((chatRoom) => {
        for (var i = 0; i < chatRoom.members.length; i++) {
          var memberID = chatRoom.members[i];

          if (memberID != userID) {
            User.update(
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
          .skip(20)
      })
      .then((messages) => {
        for (var i = 0; i < messages.length; i++) {
          var messageID = messages[i];

          Message.deleteOne({_id: messageID}).exec();
        }

        return Message.findById(message._id)
          .populate('user');
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

router.post('/delete', function(req, res, next) {
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
