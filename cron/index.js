const CronJob = require('cron').CronJob;
const fs = require('fs');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

const cron = function(socket) {
  var twoMinutes = new CronJob('0 */2 * * * *', function() {
    User.find({'mute.data': true, 'mute.endDate': {$lte: new Date()}})
      .then((users) => {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];

          User.findByIdAndUpdate(
            user._id,
            { $set: { mute: { data: false, endDate: new Date() } } },
            { safe: true, upsert: true, new: true }
          ).exec();

          socket.broadcast.emit('action', {
            type: 'SOCKET_BROADCAST_UNMUTE_MEMBER',
            memberID: user._id
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, null, true);

  var tenMinutes = new CronJob('0 */10 * * * *', function() {
    User.find({
      chatRooms: {
        $elemMatch: {
          'kick.data': true,
          'kick.endDate': {
            $lte: new Date()
          }
        }
      }
    })
    .populate({
      path: 'chatRooms.data',
      populate: {
        path: 'members'
      }
    })
    .exec()
    .then((users) => {
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

      return usersKickChatRooms;
    })
    .then((usersKickChatRooms) => {
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
          { safe: true, upsert: true, new: true }
        ).exec();
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }, null, true);

  var thirtyMinutes = new CronJob('0 */30 * * * *', function() {
    User.find({
      'ban.data': true,
      'ban.endDate': {
        $lte: new Date()
      }
    })
    .then((users) => {
      var ipBlacklist = fs.readFileSync('ip-blacklist.txt').toString().replace(/\r\n/g,'\n').split('\n');

      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var userID = user._id;

        for (var j = 0; j < ipBlacklist.length; j++) {
          if (ipBlacklist[j] == user.ipAddress) {
            ipBlacklist.splice(j, 1);
          }
        }

        User.updateOne(
          { _id: userID },
          { $set: { 'ban.data': false, 'ban.endDate': new Date() } },
          { safe: true, upsert: true, new: true }
        ).exec();
      }

      return ipBlacklist;
    })
    .then((ipBlacklist) => {
      fs.writeFile('ip-blacklist.txt', ipBlacklist.join('\n'), 'utf-8', function (error) {
        if (error) {
          console.log(error);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }, null, true);

  var day = new CronJob('0 0 0 * * *', function() {
    var today = new Date();
    today.setHours(today.getHours() - 6);

    User.find({accountType: 'guest', createdAt: {$lte: new Date(today)}})
      .then((users) => {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];
          var userID = user._id;

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

              return ChatRoom.find({members: {$in: userID}, chatType: {$in: ["group", "public"]}});
            })
            .then((chatRooms) => {
              for (var i = 0; i < chatRooms.length; i++) {
                var chatRoom = chatRooms[i];
                var chatRoomID = chatRoom._id;

                Message.deleteMany({user: userID, chatRoom: chatRoomID}).exec();
                Message.update(
                  { user: {$ne: userID}, chatRoom: chatRoomID },
                  { $pull: {readBy: userID} },
                  { safe: true }
                ).exec();
                ChatRoom.findByIdAndUpdate(
                  chatRoomID,
                  { $pull: {members: userID} },
                  { new: true, upsert: true }
                ).exec();
              }

              User.deleteOne({_id: userID}).exec();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, null, true);
}

module.exports = cron;
