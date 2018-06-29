var CronJob = require('cron').CronJob;
var User = require('../models/User');

var cron = function(socket) {
  var cronJob = new CronJob('0 */1 * * * *', function() {
    console.log('Cron task');

    User.find({
      chatRooms: {
        $elemMatch: {
          'kick.data': true,
          'kick.endDate': {
            $lte: new Date()
          }
        }
      }
    }).populate({
      path: 'chatRooms.data',
      populate: {
        path: 'members'
      }
    }).exec(function(err, users) {
      if (!err) {
        var usersKickChatRooms = [];

        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          for (var j = 0; j < user.chatRooms.length; j++) {
            var chatRoom = user.chatRooms[j];

            if (chatRoom.kick.data && chatRoom.kick.endDate <= new Date()) {
              for (var k = 0; k < chatRoom.data.members.length; k++) {
                var member = chatRoom.data.members[k];

                if (chatRoom.data.chatType === 'direct') {
                  if (member._id != user._id) {
                    chatRoom.data.name = member.name;
                    chatRoom.data.chatIcon = member.profilePicture;
                  }
                } else if ((chatRoom.data.chatType === 'group') || chatRoom.data.chatType === 'public') {
                  chatRoom.data.members[k] = member._id;
                }
              }
              usersKickChatRooms.push({user: user, chatRoom: chatRoom});
            }
          }
        }

        for (var l = 0; l < usersKickChatRooms.length; l++) {
          var userChatRoom = usersKickChatRooms[l];

          socket.broadcast.to(userChatRoom.user.socketID).emit('action', {
            type: 'SOCKET_BROADCAST_UNKICK_USER',
            chatRoom: userChatRoom.chatRoom
          });

          socket.broadcast.emit('action', {
            type: 'SOCKET_BROADCAST_UNKICK_MEMBER',
            chatRoomID: userChatRoom.chatRoom.data._id,
            member: userChatRoom.user
          });

          User.findOneAndUpdate(
            { _id: userChatRoom.user._id, 'chatRooms.data': userChatRoom.chatRoom.data._id },
            { $set: { 'chatRooms.$.kick.data': false, 'chatRooms.$.kick.endDate': new Date() } },
            { safe: true, upsert: true, new: true },
            function() {}
          );
        }
      }
    });

    User.find({
      'mute.data': true,
      'mute.endDate': {
        $lte: new Date()
      }
    }, function(err, users) {
      if (!err) {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];

          User.findByIdAndUpdate(
            user._id,
            { $set: { mute: { data: false, endDate: new Date() } } },
            { safe: true, upsert: true, new: true },
            function(err, user) {
              if (!err) {
                socket.broadcast.emit('action', {
                  type: 'SOCKET_BROADCAST_UNMUTE_MEMBER',
                  memberID: user._id
                });
              }
            }
          );
        }
      }
    });
  }, null, true);
}

module.exports = cron;