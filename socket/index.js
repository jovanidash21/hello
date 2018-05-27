var User = require('../models/User');

var users = [];

var sockets = function(socket) {
  socket.on('action', (action) => {
    switch(action.type) {
      case 'SOCKET_USER_LOGIN':
        User.findByIdAndUpdate(
          action.user._id,
          { $set: { isOnline: true, socketID: socket.id } },
          { safe: true, upsert: true, new: true },
          function(err) {
            if (!err) {
              users[socket.id] = action.user._id;

              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_USER_LOGIN',
                user: action.user
              });
            }
          }
        );
        break;
      case 'SOCKET_USER_LOGOUT':
        User.findByIdAndUpdate(
          action.user,
          { $set: { isOnline: false, socketID: ''} },
          { safe: true, upsert: true, new: true },
          function(err) {
            if (!err) {
              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_USER_LOGOUT',
                user: action.user
              });
            }
          }
        );
        break;
      case 'SOCKET_JOIN_CHAT_ROOM':
        socket.join(action.chatRoom);
        break;
      case 'SOCKET_LEAVE_CHAT_ROOM':
        socket.leave(action.chatRoom);
        break;
      case 'SOCKET_IS_TYPING':
        socket.broadcast.to(action.chatRoom).emit('action', {
          type: 'SOCKET_BROADCAST_IS_TYPING',
          typer: action.typer
        });
        break;
      case 'SOCKET_IS_NOT_TYPING':
        socket.broadcast.to(action.chatRoom).emit('action', {
          type: 'SOCKET_BROADCAST_IS_NOT_TYPING',
          typer: action.typer
        });
        break;
      case 'SOCKET_CREATE_CHAT_ROOM':
        action.members.forEach(function (chatRoomMember) {
          User.findById(chatRoomMember, function(err, user) {
            if (!err) {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_CREATE_CHAT_ROOM',
                chatRoom: action.chatRoomBroadcast
              });
            }
          });
        });
        break;
      case 'SOCKET_SEND_MESSAGE':
        socket.broadcast.to(action.chatRoom).emit('action', {
          type: 'SOCKET_BROADCAST_SEND_MESSAGE',
          message: action.message
        });
        break;
      case 'SOCKET_UPDATE_MEMBER_ROLE':
        socket.broadcast.emit('action', {
          type: 'SOCKET_BROADCAST_UPDATE_MEMBER_ROLE',
          member: action.member,
          role: action.role
        });
        break;
      case 'SOCKET_MUTE_MEMBER':
        setTimeout(function () {
          User.findByIdAndUpdate(
            action.member,
            { $set: { isMute: false, } },
            { safe: true, upsert: true, new: true },
            function(err, user) {
              if (!err) {
                socket.emit('action', {
                  type: 'SOCKET_UNMUTE_MEMBER',
                  member: action.member
                });

                socket.broadcast.to(user.socketID).emit('action', {
                  type: 'SOCKET_BROADCAST_UNMUTE_USER'
                });

                socket.broadcast.emit('action', {
                  type: 'SOCKET_BROADCAST_UNMUTE_MEMBER',
                  member: action.member
                });
              }
            }
          );
        }, 2 * 60 * 1000);

        User.findByIdAndUpdate(
          action.member,
          { $set: { isMute: true, } },
          { safe: true, upsert: true, new: true },
          function(err, user) {
            if (!err) {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_MUTE_USER'
              });

              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_MUTE_MEMBER',
                member: action.member
              });
            }
          }
        );
        break;
      default:
        break;
    }
    socket.on('disconnect', function() {
      User.findByIdAndUpdate(
        users[socket.id],
        { $set: { isOnline: false, socketID: ''} },
        { safe: true, upsert: true, new: true },
        function(err) {
          if (!err) {
            socket.broadcast.emit('action', {
              type: 'SOCKET_BROADCAST_USER_LOGOUT',
              user: users[socket.id]
            });
          }
        }
      );
    });
  });
};

module.exports = sockets;
