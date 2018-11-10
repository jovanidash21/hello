import { FETCH_ACTIVE_USER } from '../constants/user';
import {
  FETCH_MEMBERS,
  SOCKET_KICK_MEMBER,
  SOCKET_BROADCAST_KICK_MEMBER,
  SOCKET_BROADCAST_UNKICK_MEMBER,
  SOCKET_UPDATE_MEMBER_ROLE,
  SOCKET_BROADCAST_UPDATE_MEMBER_ROLE,
  SOCKET_MUTE_MEMBER,
  SOCKET_BROADCAST_MUTE_MEMBER,
  SOCKET_BROADCAST_UNMUTE_MEMBER,
  SOCKET_BLOCK_MEMBER,
  SOCKET_BROADCAST_BLOCK_MEMBER,
  SOCKET_UNBLOCK_MEMBER,
  SOCKET_BROADCAST_UNBLOCK_MEMBER
} from '../constants/member';
import {
  CHANGE_CHAT_ROOM,
  SOCKET_BROADCAST_JOIN_CHAT_ROOM,
  SOCKET_BROADCAST_LEAVE_CHAT_ROOM
} from '../constants/chat-room';
import {
  SOCKET_BROADCAST_USER_LOGIN,
  SOCKET_BROADCAST_USER_LOGOUT
} from '../constants/auth';

const memberPriority = (member) => {
  var priority = -1;

  switch (member.role) {
    case 'owner':
      priority = 1;
      break;
    case 'admin':
      priority = 2;
      break;
    case 'moderator':
      priority = 3;
      break;
    case 'vip':
      priority = 4;
      break;
    case 'ordinary':
      if ( member.accountType !== 'guest' ) {
        priority = 5;
      } else {
        priority = 6;
      }
      break;
    default:
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
  activeUser: {},
  activeChatRoom: {
    data: {}
  },
  all: []
};

const member = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_MEMBERS}_LOADING`:
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: true
        }
      };
    case `${FETCH_MEMBERS}_SUCCESS`:
      var members = [...action.payload.data.members];
      var activeUser = {...state.activeUser};

      members = members.filter(singleMember =>
        singleMember._id !== activeUser._id
      );
      activeUser.priority = memberPriority(activeUser);
      members.push(activeUser);

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        member.priority = memberPriority(member);
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
        all: [...members]
      };
    case `${FETCH_MEMBERS}_ERROR`:
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
    case `${FETCH_ACTIVE_USER}_SUCCESS`:
      return {
        ...state,
        activeUser: action.payload.data.user
      };
    case CHANGE_CHAT_ROOM:
      return {
        ...state,
        activeChatRoom: action.chatRoom
      };
    case SOCKET_BROADCAST_JOIN_CHAT_ROOM:
      var chatRoomID = action.chatRoomID;
      var user = action.user;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( ( activeChatRoom.data._id === chatRoomID ) && ( activeChatRoom.data.chatType === 'public' ) ) {
        members = members.filter(singleMember =>
          singleMember._id !== user._id
        );
        user.priority = memberPriority(user);
        members.push(user);
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_BROADCAST_LEAVE_CHAT_ROOM:
      var chatRoomID = action.chatRoomID;
      var userID = action.userID;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( ( activeChatRoom.data._id === chatRoomID ) && ( activeChatRoom.data.chatType === 'public' ) ) {
        members = members.filter(singleMember =>
          singleMember._id !== userID
        );
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_KICK_MEMBER:
    case SOCKET_BROADCAST_KICK_MEMBER:
      var chatRoomID = action.chatRoomID;
      var memberID = action.memberID;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom.data._id === chatRoomID ) {
        members = members.filter(member =>
          member._id !== memberID
        );
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_BROADCAST_UNKICK_MEMBER:
      var chatRoomID = action.chatRoomID;
      var member = action.member;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom.data._id === chatRoomID ) {
        members = members.filter(singleMember =>
          singleMember._id !== member._id
        );
        member.priority = memberPriority(member);
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
          member.priority = memberPriority(member);
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
          member.mute.data = true;
          break;
        } else {
          continue
        }
      }

      return {
        ...state,
        all: [...members]
      }
    case SOCKET_BROADCAST_UNMUTE_MEMBER:
      var memberID = action.memberID;
      var members = [...state.all];

      for (var i = 0; i < members.length; i++) {
        var member = members[i];

        if ( member._id === memberID && member.mute.data ) {
          member.mute.data = false;
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

      if ( activeChatRoom.data.chatType !== 'public' ) {
        members = members.filter(member =>
          member._id !== userID
        );

        for ( var i = 0; i < user.chatRooms.length; i++ ) {
          var chatRoom = user.chatRooms[i];

          if ( chatRoom.data === activeChatRoom.data._id && !chatRoom.kick.data ) {
            user.isOnline = true;
            user.priority = memberPriority(user);
            members.push(user);
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
    case SOCKET_BROADCAST_USER_LOGOUT:
      var userID = action.userID;
      var members = [...state.all]

      members = members.filter(member =>
        member._id !== userID
      );

      return {
        ...state,
        all: [...members]
      }
    default:
      return state;
  }
}

export default member;
