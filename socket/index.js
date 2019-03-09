var User = require('../models/User');
var ChatRoom = require('../models/ChatRoom');
var Message = require('../models/Message');
var cron = require('../cron');

var connectedUsers = {};

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
                ipAddress: socket.handshake.headers["x-real-ip"],
                socketID: socket.id
              }
            }, { safe: true, upsert: true, new: true },
          )
          .then((user) => {
            connectedUsers[socket.id] = action.user._id;

            socket.broadcast.emit('action', {
              type: 'SOCKET_BROADCAST_USER_LOGIN',
              user: user
            });
          })
          .catch((error) => {
            console.log(error);
          });
          break;
        case 'SOCKET_JOIN_CHAT_ROOM':
          var chatRoomClients = [];
          var connectedChatRoomClients = [];
          var connectedUser = {};
          var joinedChatRoom = {};

          io.in(action.chatRoomID).clients((err, clients) => {
            if (!err) {
              chatRoomClients = clients;
            }
          });

          io.in(action.connectedChatRoomID).clients((err, clients) => {
            if (!err) {
              connectedChatRoomClients = clients;
            }
          });

          User.findById(action.userID)
            .then((user) => {
              connectedUser = user;

              return ChatRoom.findById(action.chatRoomID)
                .populate('members')
                .exec();
            })
            .then((chatRoom) => {
              socket.join(action.chatRoomID);

              joinedChatRoom = chatRoom;

              if (chatRoom.chatType === 'public') {
                if (action.chatRoomID !== action.connectedChatRoomID) {
                  ChatRoom.findByIdAndUpdate(
                    action.chatRoomID,
                    { $addToSet: { connectedMembers: action.userID } },
                    { safe: true, upsert: true, new: true }
                  ).exec();
                }

                User.findByIdAndUpdate(
                  action.userID, {
                    $set: { connectedChatRoom: action.chatRoomID }
                  }, { safe: true, upsert: true, new: true },
                ).exec();

                for (var i = 0; i < chatRoom.members.length; i++) {
                  var chatRoomMember = chatRoom.members[i];

                  if (chatRoomMember._id !== action.userID) {
                    User.findById(chatRoomMember._id)
                      .then((member) => {
                        if (chatRoomClients.indexOf(member.socketID) > -1) {
                          socket.broadcast.to(member.socketID).emit('action', {
                            type: 'SOCKET_BROADCAST_JOIN_CHAT_ROOM',
                            chatRoomID: action.chatRoomID,
                            user: connectedUser
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }

                socket.broadcast.emit('action', {
                  type: 'SOCKET_BROADCAST_CONNECTED_MEMBER',
                  userID: action.userID,
                  chatRoomID: action.chatRoomID
                });
              }

              if (action.connectedChatRoomID !== '') {
                return ChatRoom.findById(action.connectedChatRoomID)
                  .populate('members')
                  .exec();
              }

              return {};
            })
            .then((chatRoom) => {
              if (
                chatRoom !== null &&
                chatRoom !== 'undefined' &&
                Object.keys(chatRoom).length > 0 &&
                Object.keys(joinedChatRoom).length > 0 &&
                action.chatRoomID !== action.connectedChatRoomID &&
                joinedChatRoom.chatType === 'public'
              ) {
                ChatRoom.findByIdAndUpdate(
                  action.connectedChatRoomID,
                  { $unset: { connectedMembers: action.userID } },
                  { safe: true, upsert: true, new: true }
                ).exec();

                for (var i = 0; i < chatRoom.members.length; i++) {
                  var chatRoomMember = chatRoom.members[i];

                  if (chatRoomMember._id !== action.userID) {
                    User.findById(chatRoomMember._id)
                      .then((member) => {
                        if (connectedChatRoomClients.indexOf(member.socketID) > -1) {
                          socket.broadcast.to(member.socketID).emit('action', {
                            type: 'SOCKET_BROADCAST_LEAVE_CHAT_ROOM',
                            chatRoomID: action.connectedChatRoomID,
                            userID: connectedUser._id
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }

                socket.broadcast.emit('action', {
                  type: 'SOCKET_BROADCAST_DISCONNECTED_MEMBER',
                  userID: action.userID,
                  chatRoomID: action.connectedChatRoomID
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_LEAVE_CHAT_ROOM':
          User.findById(action.userID)
            .then((user) => {
              if (action.chatRoomID !== '') {
                return ChatRoom.findById(action.chatRoomID)
                  .populate('members')
                  .exec();
              }

              return {};
            })
            .then((chatRoom) => {
              socket.leave(action.chatRoomID);

              if (
                chatRoom !== null &&
                chatRoom !== 'undefined' &&
                Object.keys(chatRoom).length > 0 &&
                chatRoom.chatType === 'public'
              ) {
                User.findByIdAndUpdate(
                  action.userID, {
                    $set: { connectedChatRoom: null }
                  }, { safe: true, upsert: true, new: true },
                ).exec();
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_CREATE_CHAT_ROOM':
          for (var i = 0; i < action.members.length; i++) {
            var chatRoomMember = action.members[i];

            User.findById(chatRoomMember)
              .then((user) => {
                socket.broadcast.to(user.socketID).emit('action', {
                  type: 'SOCKET_BROADCAST_CREATE_CHAT_ROOM',
                  chatRoom: action.chatRoomBroadcast
                });
              })
              .catch((error) => {
                console.log(error);
              });
          }
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
            .exec()
            .then((chatRoom) => {
              for (var i = 0; i < chatRoom.members.length; i++) {
                var chatRoomMember = chatRoom.members[i];

                User.findOneAndUpdate(
                  { _id: chatRoomMember, 'chatRooms.data': action.chatRoomID },
                  { $set: { 'chatRooms.$.trash.data': false, 'chatRooms.$.trash.endDate': new Date() } },
                  { safe: true, upsert: true, new: true },
                )
                .populate({
                  path: 'chatRooms.data'
                })
                .exec()
                .then((user) => {
                  if (chatRoomClients.indexOf(user.socketID) > -1) {
                    Message.findOneAndUpdate(
                      { _id: action.message._id, readBy: { $ne: user._id } },
                      { $addToSet: { readBy: user._id } },
                      { safe: true }
                    ).exec();

                    User.updateOne(
                      { _id: user._id, 'chatRooms.data': action.chatRoomID },
                      { $set: { 'chatRooms.$.unReadMessages': 0 } },
                      { safe: true, upsert: true, new: true }
                    ).exec();

                    socket.broadcast.to(user.socketID).emit('action', {
                      type: 'SOCKET_BROADCAST_SEND_MESSAGE',
                      message: action.message
                    });
                  } else {
                    if (chatRoom.chatType === 'direct') {
                      chatRoom.name = action.message.user.name;

                      for (var j = 0; j < user.chatRooms.length; j++) {
                        var singleChatRoom = user.chatRooms[j];

                        if ( singleChatRoom.data._id == action.chatRoomID ) {
                          socket.broadcast.to(user.socketID).emit('action', {
                            type: 'SOCKET_BROADCAST_CREATE_CHAT_ROOM',
                            chatRoom: singleChatRoom,
                          });

                          socket.broadcast.to(user.socketID).emit('action', {
                            type: 'SOCKET_BROADCAST_NOTIFY_MESSAGE',
                            chatRoom: singleChatRoom,
                            chatRoomID: action.chatRoomID,
                            chatRoomName: chatRoom.name,
                            senderName: action.message.user.name
                          });
                          break;
                        }
                      }
                    }
                  }
                })
                .catch((error) => {
                  console.log(error);
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_DELETE_MESSAGE':
          var chatRoomClients = [];

          io.in(action.chatRoomID).clients((err, clients) => {
            if (!err) {
              chatRoomClients = clients;
            }
          });

          ChatRoom.findById(action.chatRoomID)
            .populate('members')
            .exec()
            .then((chatRoom) => {
              for (var i = 0; i < chatRoom.members.length; i++) {
                var chatRoomMember = chatRoom.members[i];

                User.findById(chatRoomMember)
                  .then((user) => {
                    if (chatRoomClients.indexOf(user.socketID) > -1) {
                      socket.broadcast.to(user.socketID).emit('action', {
                        type: 'SOCKET_BROADCAST_DELETE_MESSAGE',
                        messageID: action.messageID,
                        chatRoomID: action.chatRoomID
                      });
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_START_LIVE_VIDEO':
          var chatRoomClients = [];
          var liveVideoUser = {};

          io.in(action.chatRoomID).clients((err, clients) => {
            if (!err) {
              chatRoomClients = clients;
            }
          });

          User.findById(action.userID)
            .then((user) => {
              liveVideoUser = user;

              return ChatRoom.findById(action.chatRoomID)
                .populate('members')
                .exec();
            })
            .then((chatRoom) => {
              if (chatRoom.chatType === 'public') {
                for (var i = 0; i < chatRoom.members.length; i++) {
                  var chatRoomMember = chatRoom.members[i];

                  User.findById(chatRoomMember)
                    .then((user) => {
                      if (chatRoomClients.indexOf(user.socketID) > -1) {
                        socket.broadcast.to(user.socketID).emit('action', {
                          type: 'SOCKET_BROADCAST_START_LIVE_VIDEO',
                          chatRoomID: action.chatRoomID,
                          user: liveVideoUser
                        });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_REQUEST_LIVE_VIDEO':
          User.findById(action.userID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_REQUEST_LIVE_VIDEO',
                viewerID: action.viewerID,
                peerID: action.peerID
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_ACCEPT_LIVE_VIDEO':
          User.findById(action.viewerID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_ACCEPT_LIVE_VIDEO',
                userID: action.userID,
                peerID: action.peerID
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_END_LIVE_VIDEO':
          var chatRoomClients = [];

          io.in(action.chatRoomID).clients((err, clients) => {
            if (!err) {
              chatRoomClients = clients;
            }
          });

          ChatRoom.findById(action.chatRoomID)
            .populate('members')
            .then((chatRoom) => {
              if (chatRoom.chatType === 'public') {
                for (var i = 0; i < chatRoom.members.length; i++) {
                  var chatRoomMember = chatRoom.members[i];

                  User.findById(chatRoomMember)
                    .then((user) => {
                      if (chatRoomClients.indexOf(user.socketID) > -1) {
                        socket.broadcast.to(user.socketID).emit('action', {
                          type: 'SOCKET_BROADCAST_END_LIVE_VIDEO',
                          userID: action.userID
                        });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_REQUEST_VIDEO_CALL':
          var callerUser = {};

          User.findById(action.callerID)
            .then((user) => {
              callerUser = user;

              return User.findById(action.receiverID);
            })
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_REQUEST_VIDEO_CALL',
                user: callerUser,
                peerID: action.peerID
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_CANCEL_REQUEST_VIDEO_CALL':
          User.findById(action.receiverID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_CANCEL_REQUEST_VIDEO_CALL'
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_REJECT_VIDEO_CALL':
          User.findById(action.callerID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_REJECT_VIDEO_CALL'
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_ACCEPT_VIDEO_CALL':
          User.findById(action.callerID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_ACCEPT_VIDEO_CALL',
                peerID: action.peerID
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_END_VIDEO_CALL':
          User.findById(action.callerID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_END_VIDEO_CALL'
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_BLOCK_MEMBER':
          User.findById(action.memberID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_BLOCK_USER',
                chatRoomID: action.chatRoomID
              });

              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_BLOCK_MEMBER',
                chatRoomID: action.chatRoomID,
                memberID: action.memberID
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        case 'SOCKET_KICK_MEMBER':
          User.findById(action.memberID)
            .then((user) => {
              socket.broadcast.to(user.socketID).emit('action', {
                type: 'SOCKET_BROADCAST_KICK_USER',
                chatRoomID: action.chatRoomID
              });

              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_KICK_MEMBER',
                chatRoomID: action.chatRoomID,
                memberID: action.memberID
              });
            })
            .catch((error) => {
              console.log(error);
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
          User.findById(action.memberID)
            .then((user) => {
              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_MUTE_MEMBER',
                memberID: action.memberID
              });
            })
            .catch((error) => {
              console.log(error);
            });
          break;
        default:
          break;
      }
    });

    socket.on('disconnect', function() {
      User.findById(connectedUsers[socket.id])
        .then((user) => {
          if ( user !== null && user._id !== null ) {
            ChatRoom.findByIdAndUpdate(
              user.connectedChatRoom,
              { $unset: { connectedMembers: user._id } },
              { safe: true, upsert: true, new: true }
            ).exec();

            User.updateOne(
              { _id: user._id },
              { $set: { connectedChatRoom: null, isOnline: false, isLiveVideoActive: false, ipAddress: '', socketID: ''} },
              { safe: true, upsert: true, new: true },
            ).exec();

            if (user.connectedChatRoom !== null) {
              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_DISCONNECTED_MEMBER',
                userID: user._id,
                chatRoomID: user.connectedChatRoom
              });
            }

            if (user.isLiveVideoActive) {
              socket.broadcast.emit('action', {
                type: 'SOCKET_BROADCAST_END_LIVE_VIDEO',
                userID: user._id
              });
            }

            socket.broadcast.emit('action', {
              type: 'SOCKET_BROADCAST_USER_LOGOUT',
              userID: user._id
            });
          }

          delete connectedUsers[socket.id];
        })
        .catch((error) => {
          console.log(error);
        });
    });

    User.find({_id: {$ne: null}})
      .then((users) => {
        for (var i = 0; i < users.length; i++) {
          var user = users[i];

          if (!(user.socketID in connectedUsers) && connectedUsers[user.socketID] != user._id) {
            ChatRoom.findByIdAndUpdate(
              user.connectedChatRoom,
              { $unset: { connectedMembers: user._id } },
              { safe: true, upsert: true, new: true }
            ).exec();

            User.findByIdAndUpdate(
              user._id,
              { $set: { connectedChatRoom: null, isOnline: false, isLiveVideoActive: false, socketID: ''} },
              { safe: true, upsert: true, new: true },
            ).exec();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

module.exports = sockets;
