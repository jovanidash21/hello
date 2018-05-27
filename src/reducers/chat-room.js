import {
  SOCKET_BROADCAST_USER_LOGIN,
  SOCKET_BROADCAST_USER_LOGOUT
} from '../constants/auth';
import { SOCKET_BROADCAST_KICK_USER } from '../constants/user';
import {
  FETCH_CHAT_ROOMS,
  CREATE_CHAT_ROOM,
  SOCKET_CREATE_CHAT_ROOM,
  SOCKET_BROADCAST_CREATE_CHAT_ROOM
} from '../constants/chat-room';
import {
  SOCKET_KICK_MEMBER,
  SOCKET_BROADCAST_KICK_MEMBER,
  SOCKET_UPDATE_MEMBER_ROLE,
  SOCKET_BROADCAST_UPDATE_MEMBER_ROLE,
  SOCKET_MUTE_MEMBER,
  SOCKET_BROADCAST_MUTE_MEMBER,
  SOCKET_UNMUTE_MEMBER,
  SOCKET_BROADCAST_UNMUTE_MEMBER
} from '../constants/member';

const initialState = {
  isLoading: false,
  chatRooms: []
};

const chatRoom = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_CHAT_ROOMS}_LOADING`:
      return {
        ...state,
        isLoading: true
      };
    case `${CREATE_CHAT_ROOM}_LOADING`:
      return {
        ...state
      };
    case `${FETCH_CHAT_ROOMS}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isFetchChatRoomsSuccess: true,
        chatRooms: action.payload.data.chatRooms
      };
    case `${CREATE_CHAT_ROOM}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isCreateChatRoomSuccess: true
      };
    case `${FETCH_CHAT_ROOMS}_ERROR`:
    case `${CREATE_CHAT_ROOM}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case SOCKET_BROADCAST_USER_LOGIN:
      var user = action.user;
      var userID = action.user._id;
      var chatRooms = [...state.chatRooms];
      var isUserExist = false;

      for (var i = 0; i < 1; i++) {
        var chatRoom = chatRooms[i];

        for (var j = 0; j < chatRoom.members.length; j++) {
          var member = chatRoom.members[j];

          if ( member._id === userID ) {
            isUserExist = true;
            break;
          } else {
            continue
          }
        }
      }

      if ( ! isUserExist ) {
        user.isOnline = true;
        chatRooms[0].members.push(user);
      } else {
        for (var i = 0; i < chatRooms.length; i++) {
          var chatRoom = chatRooms[i];

          for (var j = 0; j < chatRoom.members.length; j++) {
            var member = chatRoom.members[j];

            if ( member._id === userID ) {
              member.isOnline = true;
              break;
            } else {
              continue
            }
          }
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    case SOCKET_BROADCAST_USER_LOGOUT:
      var userID = action.user;
      var chatRooms = [...state.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        for (var j = 0; j < chatRoom.members.length; j++) {
          var member = chatRoom.members[j];

          if ( member._id === userID ) {
            member.isOnline = false;
            break;
          } else {
            continue
          }
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    case SOCKET_CREATE_CHAT_ROOM:
    case SOCKET_BROADCAST_CREATE_CHAT_ROOM:
      return {
        ...state,
        chatRooms: [
          ...state.chatRooms,
          action.chatRoom
        ]
      };
    case SOCKET_BROADCAST_KICK_USER:
      var chatRoomID = action.chatRoom;
      var chatRooms = [...state.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if ( chatRoom._id === chatRoomID ) {
          chatRooms.splice(i, 1);
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    case SOCKET_KICK_MEMBER:
    case SOCKET_BROADCAST_KICK_MEMBER:
      var chatRoomID = action.chatRoom;
      var memberID = action.member;
      var chatRooms = [...state.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if ( chatRoom._id === chatRoomID ) {
          for (var j = 0; j < chatRoom.members.length; j++) {
            var member = chatRoom.members[j];

            if ( member._id === memberID ) {
              chatRoom.members.splice(j, 1);
              break;
            } else {
              continue
            }
          }
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    case SOCKET_UPDATE_MEMBER_ROLE:
    case SOCKET_BROADCAST_UPDATE_MEMBER_ROLE:
      var memberID = action.member;
      var role = action.role;
      var chatRooms = [...state.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        for (var j = 0; j < chatRoom.members.length; j++) {
          var member = chatRoom.members[j];

          if ( member._id === memberID ) {
            member.role = role;
            break;
          } else {
            continue
          }
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    case SOCKET_MUTE_MEMBER:
    case SOCKET_BROADCAST_MUTE_MEMBER:
      var memberID = action.member;
      var chatRooms = [...state.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        for (var j = 0; j < chatRoom.members.length; j++) {
          var member = chatRoom.members[j];

          if ( member._id === memberID ) {
            member.isMute = true;
            break;
          } else {
            continue
          }
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    case SOCKET_UNMUTE_MEMBER:
    case SOCKET_BROADCAST_UNMUTE_MEMBER:
      var memberID = action.member;
      var chatRooms = [...state.chatRooms];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        for (var j = 0; j < chatRoom.members.length; j++) {
          var member = chatRoom.members[j];

          if ( member._id === memberID ) {
            member.isMute = false;
            break;
          } else {
            continue
          }
        }
      }

      return {
        ...state,
        chatRooms: [...chatRooms]
      }
    default:
      return state;
  }
}

export default chatRoom;
