import {
  FETCH_MEMBERS,
  SOCKET_KICK_MEMBER,
  SOCKET_BROADCAST_KICK_MEMBER,
  SOCKET_UNKICK_MEMBER,
  SOCKET_BROADCAST_UNKICK_MEMBER,
  SOCKET_UPDATE_MEMBER_ROLE,
  SOCKET_BROADCAST_UPDATE_MEMBER_ROLE,
  SOCKET_MUTE_MEMBER,
  SOCKET_BROADCAST_MUTE_MEMBER,
  SOCKET_UNMUTE_MEMBER,
  SOCKET_BROADCAST_UNMUTE_MEMBER
} from '../constants/member';
import { CHANGE_CHAT_ROOM } from '../constants/chat-room';
import {
  SOCKET_BROADCAST_USER_LOGIN,
  SOCKET_BROADCAST_USER_LOGOUT
} from '../constants/auth';

const initialState = {
  isLoading: false,
  activeChatRoom: {},
  all: []
};

const member = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_MEMBERS}_LOADING`:
      return {
        ...state,
        isLoading: true
      };
    case `${FETCH_MEMBERS}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isFetchMembersSuccess: true,
        all: action.payload.data
      };
    case `${FETCH_MEMBERS}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case CHANGE_CHAT_ROOM:
      return {
        ...state,
        activeChatRoom: action.chatRoom
      };
    case SOCKET_KICK_MEMBER:
    case SOCKET_BROADCAST_KICK_MEMBER:
      var chatRoomID = action.chatRoomID;
      var memberID = action.memberID;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom._id === chatRoomID ) {
        for (var i = 0; i < members.length; i++) {
          var member = members[i];

          if ( member._id === memberID ) {
            members.splice(i, 1);
            break;
          } else {
            continue
          }
        }
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_UNKICK_MEMBER:
    case SOCKET_BROADCAST_UNKICK_MEMBER:
      var chatRoomID = action.chatRoomID;
      var member = action.member;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom._id === chatRoomID ) {
        members.push(member);
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_UPDATE_MEMBER_ROLE:
    case SOCKET_BROADCAST_UPDATE_MEMBER_ROLE:
      var memberID = action.memberID;
      var role = action.role;
      var members = [...state.all];

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if ( member._id === memberID ) {
          member.role = role;
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_MUTE_MEMBER:
    case SOCKET_BROADCAST_MUTE_MEMBER:
      var memberID = action.memberID;
      var members = [...state.all];

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if ( member._id === memberID ) {
          member.isMute = true;
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_UNMUTE_MEMBER:
    case SOCKET_BROADCAST_UNMUTE_MEMBER:
      var memberID = action.memberID;
      var members = [...state.all];

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if ( member._id === memberID ) {
          member.isMute = false;
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_BROADCAST_USER_LOGIN:
      var user = action.user;
      var userID = user._id;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];
      var isUserExist = false;

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if ( member._id === userID ) {
          member.isOnline = true;
          isUserExist = true;
          break;
        } else {
          continue
        }
      }

      if ( activeChatRoom.chatType === 'public' && !isUserExist ) {
        user.isOnline = true;
        members.push(user);
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_BROADCAST_USER_LOGOUT:
      var userID = action.userID;
      var members = [...state.all]

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if ( member._id === userID ) {
          member.isOnline = false;
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        all: [...members]
      }
    default:
      return state;
  }
}

export default member;
