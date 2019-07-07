const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const ChatRoom = require('../../models/ChatRoom');
const Message = require('../../models/Message');

router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/email', require('./email'));
router.use('/user', require('./user'));
router.use('/chat-room', require('./chat-room'));
router.use('/message', require('./message'));
router.use('/member', require('./member'));
router.use('/live-video', require('./live-video'));
router.use('/blocked-user', require('./blocked-user'));
router.use('/banned-user', require('./banned-user'));
router.use('/upload', require('./upload'));

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

module.exports = router;
