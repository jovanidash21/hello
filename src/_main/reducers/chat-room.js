import {
  FETCH_CHAT_ROOMS,
  CHANGE_CHAT_ROOM,
  CREATE_CHAT_ROOM,
  SOCKET_CREATE_CHAT_ROOM,
  SOCKET_BROADCAST_CREATE_CHAT_ROOM,
  CLEAR_CHAT_ROOM_UNREAD_MESSAGES,
  TRASH_ALL_CHAT_ROOMS,
  TRASH_CHAT_ROOM
} from '../constants/chat-room';
import {
  SOCKET_BROADCAST_USER_LOGIN,
  SOCKET_BROADCAST_USER_LOGOUT
} from '../constants/auth';
import {
  SOCKET_BROADCAST_CONNECTED_MEMBER,
  SOCKET_BROADCAST_DISCONNECTED_MEMBER
} from '../constants/member';
import {
  FETCH_NEW_MESSAGES,
  SOCKET_BROADCAST_NOTIFY_MESSAGE,
  SOCKET_BROADCAST_NOTIFY_MESSAGE_MENTION
} from '../constants/message';
import {
  SOCKET_BROADCAST_KICK_USER,
  SOCKET_BROADCAST_UNKICK_USER
} from '../constants/user';

const chatRoomPriority = (chatRoom) => {
  var priority = -1;

  switch (chatRoom.chatType) {
    case 'public':
      priority = 1;
      break;
    default:
      priority = 2;
      break;
  }

  return priority;
}

const commonStateFlags = {
  loading: false,
  success: false,
  error: false,
  message: ''
};

const initialState = {
  fetch: {...commonStateFlags},
  create: {...commonStateFlags},
  clear: {...commonStateFlags},
  trashAll: {...commonStateFlags},
  trash: {
    chatRoomID: '',
    ...commonStateFlags
  },
  active: {
    data: {}
  },
  all: []
};

const chatRoom = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_CHAT_ROOMS}_LOADING`: {
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: true
        }
      };
    }
    case `${CREATE_CHAT_ROOM}_LOADING`: {
      return {
        ...state,
        create: {
          ...state.create,
          loading: true
        }
      };
    }
    case `${CLEAR_CHAT_ROOM_UNREAD_MESSAGES}_LOADING`: {
      return {
        ...state,
        clear: {
          ...state.clear,
          loading: true
        }
      };
    }
    case `${TRASH_ALL_CHAT_ROOMS}_LOADING`: {
      return {
        ...state,
        trashAll: {
          ...state.trashAll,
          loading: true
        }
      };
    }
    case `${TRASH_CHAT_ROOM}_LOADING`: {
      var chatRoomID = action.meta;

      return {
        ...state,
        trash: {
          ...state.trash,
          chatRoomID: chatRoomID,
          loading: true
        }
      };
    }
    case `${FETCH_CHAT_ROOMS}_SUCCESS`: {
      var chatRooms = [...action.payload.data.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        chatRoom.priority = chatRoomPriority(chatRoom.data);
      }

      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        all: [...chatRooms]
      };
    }
    case `${CREATE_CHAT_ROOM}_SUCCESS`: {
      return {
        ...state,
        create: {
          ...state.create,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        }
      };
    }
    case `${CLEAR_CHAT_ROOM_UNREAD_MESSAGES}_SUCCESS`: {
      var chatRoomIDs = action.payload.data.chatRoomIDs;
      var chatRooms = [...state.all];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if ( chatRoomIDs.indexOf(chatRoom.data._id) > -1 ) {
          chatRoom.unReadMessages = 0;
        }
      }

      return {
        ...state,
        clear: {
          ...state.clear,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        all: [...chatRooms]
      };
    }
    case `${TRASH_ALL_CHAT_ROOMS}_SUCCESS`: {
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];

      if ( activeChatRoom.data.chatType === 'direct' ) {
        location.reload();
      }

      chatRooms = chatRooms.filter(chatRoom =>
        chatRoom.data.chatType !== 'direct'
      );

      return {
        ...state,
        trashAll: {
          ...state.trashAll,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        all: [...chatRooms]
      };
    }
    case `${TRASH_CHAT_ROOM}_SUCCESS`: {
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];
      var chatRoomID = action.meta;

      if ( activeChatRoom.data._id === chatRoomID ) {
        location.reload();
      }

      chatRooms = chatRooms.filter(chatRoom =>
        chatRoom.data._id !== chatRoomID
      );

      return {
        ...state,
        trash: {
          ...state.trash,
          chatRoomID: '',
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        all: [...chatRooms]
      };
    }
    case `${FETCH_CHAT_ROOMS}_ERROR`: {
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    }
    case `${CREATE_CHAT_ROOM}_ERROR`: {
      return {
        ...state,
        create: {
          ...state.create,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    }
    case `${CLEAR_CHAT_ROOM_UNREAD_MESSAGES}_ERROR`: {
      return {
        ...state,
        clear: {
          ...state.clear,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    }
    case `${TRASH_CHAT_ROOM}_ERROR`: {
      return {
        ...state,
        trash: {
          ...state.trash,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    }
    case `${TRASH_ALL_CHAT_ROOMS}_ERROR`: {
      return {
        ...state,
        trashAll: {
          ...state.trashAll,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    }
    case CHANGE_CHAT_ROOM: {
      var chatRooms = [...state.all];
      var activeChatRoom = {...action.chatRoom};
      var userID = action.userID;
      var connectedChatRoomID = action.connectedChatRoomID;

      if (
        ( activeChatRoom.data.chatType === 'public' ) &&
        ( activeChatRoom.data._id !== connectedChatRoomID )
      ) {
        if (
          ( activeChatRoom.data.connectedMembers.length >= 0 ) &&
          ( activeChatRoom.data.connectedMembers.length < 500 ) &&
          ( activeChatRoom.data.connectedMembers.indexOf(userID) === -1 )
        ) {
          activeChatRoom.data.connectedMembers.push(userID);
        }

        var activeChatRoomFound = false;
        var connectedChatRoomFound = false;

        for (var i = 0; i < chatRooms.length; i++) {
          var chatRoom = chatRooms[i];

          if (
            ( ! activeChatRoomFound ) &&
            ( chatRoom.data._id === activeChatRoom.data._id ) &&
            ( chatRoom.data.chatType === 'public' ) &&
            ( chatRoom.data.connectedMembers.length >= 0 ) &&
            ( chatRoom.data.connectedMembers.length < 500 ) &&
            ( chatRoom.data.connectedMembers.indexOf(userID) === -1 )
          ) {
            chatRoom.data.connectedMembers.push(userID);
            activeChatRoomFound = true;
          } else if (
            ( ! connectedChatRoomFound ) &&
            ( chatRoom.data._id === connectedChatRoomID ) &&
            ( chatRoom.data.chatType === 'public' ) &&
            ( chatRoom.data.connectedMembers.length > 0 ) &&
            ( chatRoom.data.connectedMembers.length <= 500 ) &&
            ( chatRoom.data.connectedMembers.indexOf(userID) > -1 )
          ) {
            chatRoom.data.connectedMembers = chatRoom.data.connectedMembers.filter(memberID =>
              memberID !== userID
            );
            connectedChatRoomFound = true;
          }

          if ( activeChatRoomFound && connectedChatRoomFound ) {
            break;
          }
        }
      }

      return {
        ...state,
        active: {...activeChatRoom},
        all: [...chatRooms]
      };
    }
    case SOCKET_CREATE_CHAT_ROOM:
    case SOCKET_BROADCAST_CREATE_CHAT_ROOM: {
      var chatRoom = {...action.chatRoom};
      var chatRooms = [...state.all];

      if ( !chatRooms.some((singleChatRoom) => singleChatRoom.data._id === chatRoom.data._id)) {
        chatRoom.priority = chatRoomPriority(chatRoom.data);
        chatRooms = [...chatRooms, {...chatRoom}];
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    }
    case SOCKET_BROADCAST_USER_LOGIN: {
      var user = action.user;
      var userID = user._id;
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];
      var members = activeChatRoom.data.members;

      if ( chatRooms.length > 0 ) {
        if (
          activeChatRoom.data.chatType === 'public' &&
          members.indexOf(userID) == -1
        ) {
          members.push(userID);
        }

        if ( activeChatRoom.data.chatType === 'direct' ) {
          var members = activeChatRoom.data.members;

          if ( members.length > 0 ) {
            var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

            if ( memberIndex > -1 ) {
              members[memberIndex].isOnline = true;
            }
          }
        }

        for (var i = 0; i < chatRooms.length; i++) {
          var chatRoom = chatRooms[i];
          var members = chatRoom.data.members;

          if ( ( chatRoom.data.chatType === 'direct' ) && ( members.length > 0 ) ) {
            var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

            if ( memberIndex > -1 ) {
              members[memberIndex].isOnline = true;
            }
          }
        }
      }

      return {
        ...state,
        active: {...activeChatRoom},
        all: [...chatRooms]
      }
    }
    case SOCKET_BROADCAST_USER_LOGOUT: {
      var userID = action.userID;
      var chatRooms = [...state.all];
      var activeChatRoom = {...state.active};

      if ( chatRooms.length > 0 ) {
        if ( activeChatRoom.data.chatType === 'direct' ) {
          var members = activeChatRoom.data.members;

          if ( members.length > 0 ) {
            var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

            if ( memberIndex > -1 ) {
              members[memberIndex].isOnline = false;
            }
          }
        }

        for (var i = 0; i < chatRooms.length; i++) {
          var chatRoom = chatRooms[i];
          var members = chatRoom.data.members;

          if ( ( chatRoom.data.chatType === 'direct' ) && ( members.length > 0 ) ) {
            var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

            if ( memberIndex > -1 ) {
              members[memberIndex].isOnline = false;
            }
          }
        }
      }

      return {
        ...state,
        active: {...activeChatRoom},
        all: [...chatRooms]
      }
    }
    case SOCKET_BROADCAST_CONNECTED_MEMBER: {
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];
      var userID = action.userID;
      var chatRoomID = action.chatRoomID;

      if (
        ( activeChatRoom.data._id === chatRoomID ) &&
        ( activeChatRoom.data.chatType === 'public' ) &&
        ( activeChatRoom.data.connectedMembers.length >= 0 ) &&
        ( activeChatRoom.data.connectedMembers.length < 500 ) &&
        ( activeChatRoom.data.connectedMembers.indexOf(userID) === -1 )
      ) {
        activeChatRoom.data.connectedMembers.push(userID);
      }

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if (
          ( chatRoom.data._id === chatRoomID ) &&
          ( chatRoom.data.chatType === 'public' ) &&
          ( chatRoom.data.connectedMembers.length >= 0 ) &&
          ( chatRoom.data.connectedMembers.length < 500 ) &&
          ( chatRoom.data.connectedMembers.indexOf(userID) === -1 )
        ) {
          chatRoom.data.connectedMembers.push(userID);
          break;
        } else {
          continue;
        }
      }

      return {
        ...state,
        active: {...activeChatRoom},
        all: [...chatRooms]
      }
    }
    case SOCKET_BROADCAST_DISCONNECTED_MEMBER: {
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];
      var userID = action.userID;
      var chatRoomID = action.chatRoomID;

      if (
        ( activeChatRoom.data._id === chatRoomID ) &&
        ( activeChatRoom.data.chatType === 'public' ) &&
        ( activeChatRoom.data.connectedMembers.length > 0 ) &&
        ( activeChatRoom.data.connectedMembers.length <= 500 ) &&
        ( activeChatRoom.data.connectedMembers.indexOf(userID) > -1 )
      ) {
        activeChatRoom.data.connectedMembers = activeChatRoom.data.connectedMembers.filter(memberID =>
          memberID !== userID
        );
      }

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if (
          ( chatRoom.data._id === chatRoomID ) &&
          ( chatRoom.data.chatType === 'public' ) &&
          ( chatRoom.data.connectedMembers.length > 0 ) &&
          ( chatRoom.data.connectedMembers.length <= 500 ) &&
          ( chatRoom.data.connectedMembers.indexOf(userID) > -1 )
        ) {
          chatRoom.data.connectedMembers = chatRoom.data.connectedMembers.filter(memberID =>
            memberID !== userID
          );
          break;
        } else {
          continue;
        }
      }

      return {
        ...state,
        active: {...activeChatRoom},
        all: [...chatRooms]
      }
    }
    case `${FETCH_NEW_MESSAGES}_SUCCESS`: {
      var chatRoomID = action.meta;
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].unReadMessages = 0;

        if ( chatRoomID === activeChatRoom.data._id ) {
          activeChatRoom.unReadMessages = 0;
        }
      }

      return {
        ...state,
        all: [...chatRooms]
      }
    }
    case SOCKET_BROADCAST_NOTIFY_MESSAGE:
    case SOCKET_BROADCAST_NOTIFY_MESSAGE_MENTION: {
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];
      var chatRoomID = action.chatRoomID;

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].unReadMessages++;
        chatRooms[chatRoomIndex].data.latestMessageDate = new Date();
      }

      return {
        ...state,
        all: [...chatRooms]
      }
    }
    case SOCKET_BROADCAST_KICK_USER: {
      var chatRoomID = action.chatRoomID;
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];

      if ( activeChatRoom.data._id === chatRoomID ) {
        location.reload();
      }

      chatRooms = chatRooms.filter(chatRoom =>
        chatRoom.data._id !== chatRoomID
      );

      return {
        ...state,
        all: [...chatRooms]
      }
    }
    case SOCKET_BROADCAST_UNKICK_USER: {
      var chatRoom = action.chatRoom;
      var chatRooms = [...state.all];

      chatRooms = chatRooms.filter(singleChatRoom =>
        singleChatRoom.data._id !== chatRoom.data._id
      );

      chatRoom.priority = chatRoomPriority(chatRoom.data);
      chatRooms.push(chatRoom);

      return {
        ...state,
        all: [...chatRooms]
      }
    }
    default:
      return state;
  }
}

export default chatRoom;
