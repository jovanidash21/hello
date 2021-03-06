import {
  FETCH_ACTIVE_USER,
  EDIT_ACTIVE_USER,
  SOCKET_BROADCAST_EDIT_ACTIVE_USER,
} from '../constants/user';
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
  START_LIVE_VIDEO,
  SOCKET_BROADCAST_START_LIVE_VIDEO,
  END_LIVE_VIDEO,
  SOCKET_BROADCAST_END_LIVE_VIDEO
} from '../constants/live-video-user';
import {
  BLOCK_USER,
  UNBLOCK_USER,
  UNBLOCK_ALL_USERS,
} from '../constants/blocked-user';
import {
  BAN_USER,
  SOCKET_BROADCAST_BAN_USER,
  UNBAN_USER,
  UNBAN_ALL_USERS,
} from '../constants/banned-user';
import {
  SOCKET_BROADCAST_USER_LOGIN,
  SOCKET_BROADCAST_USER_LOGOUT
} from '../constants/auth';
import { isObjectEmpty } from '../../utils/object';

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
    case `${FETCH_MEMBERS}_LOADING`: {
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: true
        }
      };
    }
    case `${FETCH_MEMBERS}_SUCCESS`: {
      var members = [...action.payload.data.members];
      var activeUser = {...state.activeUser};

      members = members.filter(singleMember =>
        singleMember._id !== activeUser._id
      );
      activeUser.isOnline = true;
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
    }
    case `${FETCH_MEMBERS}_ERROR`: {
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
    case `${FETCH_ACTIVE_USER}_SUCCESS`: {
      return {
        ...state,
        activeUser: action.payload.data.user
      };
    }
    case `${EDIT_ACTIVE_USER}_SUCCESS`: {
      var user = action.payload.data.user;
      var members = [...state.all];

      var memberIndex = members.findIndex(singleMember => singleMember._id === user._id);

      if ( memberIndex > -1 ) {
        members[memberIndex] = {
          ...members[memberIndex],
          ...user,
        };
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_BROADCAST_EDIT_ACTIVE_USER: {
      var user = action.user;
      var members = [...state.all];

      var memberIndex = members.findIndex(singleMember => singleMember._id === user._id);

      if ( memberIndex > -1 ) {
        members[memberIndex] = {
          ...members[memberIndex],
          ...user,
        };
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case CHANGE_CHAT_ROOM: {
      return {
        ...state,
        activeChatRoom: action.chatRoom
      };
    }
    case SOCKET_BROADCAST_JOIN_CHAT_ROOM: {
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
    }
    case SOCKET_BROADCAST_LEAVE_CHAT_ROOM: {
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
    }
    case SOCKET_KICK_MEMBER:
    case SOCKET_BROADCAST_KICK_MEMBER: {
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
    }
    case SOCKET_BROADCAST_UNKICK_MEMBER: {
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
    }
    case SOCKET_UPDATE_MEMBER_ROLE:
    case SOCKET_BROADCAST_UPDATE_MEMBER_ROLE: {
      var memberID = action.memberID;
      var role = action.role;
      var members = [...state.all];

      var memberIndex = members.findIndex(singleMember => singleMember._id === memberID);

      if ( memberIndex > -1 ) {
        members[memberIndex].role = role;
        members[memberIndex].priority = memberPriority(members[memberIndex]);
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_MUTE_MEMBER:
    case SOCKET_BROADCAST_MUTE_MEMBER: {
      var memberID = action.memberID;
      var members = [...state.all];

      var memberIndex = members.findIndex(singleMember => singleMember._id === memberID);

      if ( memberIndex > -1 ) {
        members[memberIndex].mute.data = true;
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_BROADCAST_UNMUTE_MEMBER: {
      var memberID = action.memberID;
      var members = [...state.all];

      var memberIndex = members.findIndex(singleMember => singleMember._id === memberID && singleMember.mute.data );

      if ( memberIndex > -1 ) {
        members[memberIndex].mute.data = false;
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case `${START_LIVE_VIDEO}_SUCCESS`: {
      var user = action.meta;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom.data.chatType === 'public' ) {
        var memberIndex = members.findIndex(singleMember => singleMember._id === user._id);

        if ( memberIndex > -1 ) {
          members[memberIndex].isLiveVideoActive = true;
        }
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_BROADCAST_START_LIVE_VIDEO: {
      var user = action.user;
      var chatRoomID = action.chatRoomID;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom.data.chatType === 'public' && activeChatRoom.data._id === chatRoomID ) {
        var memberIndex = members.findIndex(singleMember => singleMember._id === user._id);

        if ( memberIndex > -1 ) {
          members[memberIndex].isLiveVideoActive = true;
        }
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case `${END_LIVE_VIDEO}_SUCCESS`: {
      var userID = action.meta;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom.data.chatType === 'public' ) {
        var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

        if ( memberIndex > -1 ) {
          members[memberIndex].isLiveVideoActive = false;
        }
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_BROADCAST_END_LIVE_VIDEO: {
      var userID = action.userID;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( activeChatRoom.data.chatType === 'public' ) {
        var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

        if ( memberIndex > -1 ) {
          members[memberIndex].isLiveVideoActive = false;
        }
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_BROADCAST_USER_LOGIN: {
      var user = action.user;
      var userID = user._id;
      var activeChatRoom = {...state.activeChatRoom};
      var members = [...state.all];

      if ( ! isObjectEmpty( activeChatRoom.data ) && activeChatRoom.data.chatType !== 'public' ) {
        members = members.filter(member =>
          member._id !== userID
        );

        var memberIndex = -1;
        var chatRoomMembers = activeChatRoom.data.members;

        if ( activeChatRoom.data.chatType === 'group' ) {
          memberIndex = chatRoomMembers.findIndex(singleMember => singleMember === userID);
        } else {
          memberIndex = chatRoomMembers.findIndex(singleMember => singleMember._id === userID);
        }

        if ( memberIndex > -1 ) {
          user.isOnline = true;
          user.priority = memberPriority(user);
          members.push(user);
        }
      }

      return {
        ...state,
        all: [...members]
      }
    }
    case `${BLOCK_USER}_SUCCESS`: {
      const blockedUserID = action.meta;
      const members = [...state.all];

      const memberIndex = members.findIndex(( singleMember ) => {
        return singleMember._id === blockedUserID;
      });

      if ( memberIndex > -1 ) {
        members[memberIndex].blocked = true;
      }

      return {
        ...state,
        all: [ ...members ],
      }
    }
    case `${UNBLOCK_USER}_SUCCESS`: {
      const unblockedUserID = action.meta;
      const members = [...state.all];

      const memberIndex = members.findIndex(( singleMember ) => {
        return singleMember._id === unblockedUserID;
      });

      if ( memberIndex > -1 ) {
        members[memberIndex].blocked = false;
      }

      return {
        ...state,
        all: [ ...members ],
      }
    }
    case `${UNBLOCK_ALL_USERS}_SUCCESS`: {
      const members = [...state.all];

      for ( let i = 0; i < members.length; i += 1 ) {
        members[i].blocked = false;
      }

      return {
        ...state,
        all: [ ...members ],
      };
    }
    case `${BAN_USER}_SUCCESS`: {
      const bannedUserID = action.meta;
      let members = [...state.all];

      const memberIndex = members.findIndex(( singleMember ) => {
        return singleMember._id === bannedUserID;
      });

      if ( memberIndex > -1 ) {
        members[memberIndex].ban.data = true;
      }

      members = members.filter(member =>
        member._id !== bannedUserID
      );

      return {
        ...state,
        all: [ ...members ],
      }
    }
    case `${UNBAN_USER}_SUCCESS`: {
      const unbannedUserID = action.meta;
      const members = [...state.all];

      const memberIndex = members.findIndex(( singleMember ) => {
        return singleMember._id === unbannedUserID;
      });

      if ( memberIndex > -1 ) {
        members[memberIndex].ban.data = false;
      }

      return {
        ...state,
        all: [ ...members ],
      }
    }
    case `${UNBAN_ALL_USERS}_SUCCESS`: {
      const members = [...state.all];

      for ( let i = 0; i < members.length; i += 1 ) {
        members[i].ban.data = false;
      }

      return {
        ...state,
        all: [ ...members ],
      };
    }
    case SOCKET_BROADCAST_BAN_USER: {
      var bannedUserID = action.bannedUserID;
      var members = [...state.all];

      members = members.filter(member =>
        member._id !== bannedUserID
      );

      return {
        ...state,
        all: [...members]
      }
    }
    case SOCKET_BROADCAST_USER_LOGOUT: {
      var userID = action.userID;
      var members = [...state.all]

      members = members.filter(member =>
        member._id !== userID
      );

      return {
        ...state,
        all: [...members]
      }
    }
    default:
      return state;
  }
}

export default member;
