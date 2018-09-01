var User = require('../models/User');
var ChatRoom = require('../models/ChatRoom');
var Message = require('../models/Message');
var cron = require('../cron');

var users = {};

var sockets = function(io) {
  io.sockets.on('connection', function (socket) {
    cron(socket);

    socket.on('action', (action) => {
      switch(action.type) {
        case 'SOCKET_USER_LOGIN':
          User.findByIdAndUpdate(
            action.user._id, {
              $set: {
                isOnline: true,
                ipAddress: socket.request.connection.remoteAddress.replace('::ffff:', ''),
                socketID: socket.id
              }
            }, { safe: true, upsert: true, new: true },
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
        case 'SOCKET_JOIN_CHAT_ROOM':
          socket.join(action.chatRoomID);
          break;
        case 'SOCKET_LEAVE_CHAT_ROOM':
          socket.leave(action.chatRoomID);
          break;
        case 'SOCKET_IS_TYPING':
          socket.broadcast.to(action.chatRoomID).emit('action', {
            type: 'SOCKET_BROADCAST_IS_TYPING',
            typer: action.typer,
            chatRoomID: action.chatRoomID
          });
          break;
        case 'SOCKET_IS_NOT_TYPING':
          socket.broadcast.to(action.chatRoomID).emit('action', {
            type: 'SOCKET_BROADCAST_IS_NOT_TYPING',
            typer: action.typer,
            chatRoomID: action.chatRoomID
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
          var chatRoomClients = [];

          io.in(action.chatRoomID).clients((err, clients) => {
            if (!err) {
              chatRoomClients = clients;
            }
          });

          ChatRoom.findById(action.chatRoomID)
            .populate('members')
            .exec(function(err, chatRoom) {
              if (!err) {
                for (var i = 0; i < chatRoom.members.length; i++) {
                  var chatRoomMember = chatRoom.members[i];

                  User.findOneAndUpdate(
                    { _id: chatRoomMember, 'chatRooms.data': action.chatRoomID },
                    { $set: { 'chatRooms.$.trash.data': false, 'chatRooms.$.trash.endDate': new Date() } },
                    { safe: true, upsert: true, new: true },
                    function(err, user) {
                      if (!err) {
                        if (chatRoomClients.indexOf(user.socketID) > -1) {
                          Message.findOneAndUpdate(
                            { _id: action.message._id, readBy: { $ne: user._id } },
                            { $addToSet: { readBy: user._id } },
                            { safe: true, upsert: true, new: true },
                            function(err) {
                              if (!err) {
                                User.update(
                                  { _id: user._id, 'chatRooms.data': action.chatRoomID },
                                  { $set: { 'chatRooms.$.unReadMessages': 0 } },
                                  { safe: true, upsert: true, new: true },
                                  function(err) {
                                    if (!err) {
                                      socket.broadcast.to(user.socketID).emit('action', {
                                        type: 'SOCKET_BROADCAST_SEND_MESSAGE',
                                        message: action.message
                                      });
                                    }
                                  }
                                );
                              }
                            }
                          );
                        } else {
                          if (chatRoom.chatType === 'direct') {
                            chatRoom.name = action.message.user.name;

                            socket.broadcast.to(user.socketID).emit('action', {
                              type: 'SOCKET_BROADCAST_NOTIFY_MESSAGE',
                              chatRoom: {data: chatRoom, unReadMessages: 0},
                              chatRoomID: action.chatRoomID,
                              chatRoomName: chatRoom.name,
                              senderName: action.message.user.name
                            });
                          }
                        }
                      }
                    }
                  );
                }
              }
            });
          break;
        case 'SOCKET_BLOCK_MEMBER':
          User.findById(action.memberID, function(err, user) {
            if (!err) {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_BLOCK_USER',
                chatRoomID: action.chatRoomID
              });

              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_BLOCK_MEMBER',
                chatRoomID: action.chatRoomID,
                memberID: action.memberID
              });
            }
          });
          break;
        case 'SOCKET_KICK_MEMBER':
          User.findById(action.memberID, function(err, user) {
            if (!err) {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_KICK_USER',
                chatRoomID: action.chatRoomID
              });

              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_KICK_MEMBER',
                chatRoomID: action.chatRoomID,
                memberID: action.memberID
              });
            }
          });
          break;
        case 'SOCKET_UPDATE_MEMBER_ROLE':
          socket.broadcast.emit('action', {
            type: 'SOCKET_BROADCAST_UPDATE_MEMBER_ROLE',
            memberID: action.memberID,
            role: action.role
          });
          break;
        case 'SOCKET_MUTE_MEMBER':
          User.findById(action.memberID, function(err, user) {
            if (!err) {
              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_MUTE_MEMBER',
                memberID: action.memberID
              });
            }
          });
          break;
        default:
          break;
      }
    });
    socket.on('disconnect', function() {
      User.findByIdAndUpdate(
        users[socket.id],
        { $set: { isOnline: false, ipAddress: '', socketID: ''} },
        { safe: true, upsert: true, new: true },
        function(err) {
          if (!err) {
            socket.broadcast.emit('action', {
              type: 'SOCKET_BROADCAST_USER_LOGOUT',
              userID: users[socket.id]
            });

            delete users[socket.id];
          }
        }
      );
    });
  });
};

module.exports = sockets;
