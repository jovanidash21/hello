var express = require('express');
var router = express.Router();
var User = require('../models/User');
var ChatRoom = require('../models/ChatRoom');
var Message = require('../models/Message');

router.get('/', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Chat App | Login' });
  } else {
    res.redirect('/chat');
  }
});

router.get('/logout', (req, res) => {
  if (req.user !== 'undefined' && req.user.accountType === 'guest') {
    var userID = req.user._id;

    ChatRoom.find({members: {$in: userID}, chatType: "direct"})
      .then((chatRooms) => {
        for (var j = 0; j < chatRooms.length; j++) {
          var chatRoom = chatRooms[j];
          var chatRoomID = chatRoom._id;

          for (var k = 0; k < chatRoom.members.length; k++) {
            var memberID = chatRoom.members[k];

            if (memberID != userID) {
              User.findByIdAndUpdate(
                memberID,
                { $pull: {chatRooms: {data: chatRoomID}} },
                { new: true, upsert: true }
              ).exec();
            }
          }

          Message.deleteMany({chatRoom: chatRoomID}).exec();
          ChatRoom.deleteOne({_id: chatRoomID}).exec();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  req.logout();
  res.redirect('/');
});

router.get('/register', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Chat App | Register' });
  } else {
    res.redirect('/chat');
  }
});

router.get('/guest', (req, res, next) => {
  if (!req.user) {
    res.render('index', { title: 'Chat App | Guest' });
  } else {
    res.redirect('/chat');
  }
});

router.get('/chat', (req, res, next) => {
  if (req.user) {
    res.render('index', { title: 'Chat App' });
  } else {
    res.redirect('/');
  }
});

router.get('/admin', (req, res, next) => {
  if (req.user && (req.user.role == 'owner' || req.user.role == 'admin')) {
    res.render('index', { title: 'Chat App | Admin' });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
