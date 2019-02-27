import {
  FETCH_ACTIVE_USER,
  SEARCH_USER
} from '../constants/user';
import { CHANGE_CHAT_ROOM } from '../constants/chat-room';
import {
  SOCKET_BROADCAST_MUTE_MEMBER,
  SOCKET_BROADCAST_UNMUTE_MEMBER
} from '../constants/member';

const commonStateFlags = {
  loading: false,
  success: false,
  error: false,
  message: ''
};

const initialState = {
  fetchActive: {...commonStateFlags},
  search: {...commonStateFlags},
  active: {},
  searched: []
};

const user = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_ACTIVE_USER}_LOADING`:
      return {
        ...state,
        fetchActive: {
          ...state.fetchActive,
          loading: true
        }
      };
    case `${SEARCH_USER}_LOADING`:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true
        },
        searched: []
      };
    case `${FETCH_ACTIVE_USER}_SUCCESS`:
      return {
        ...state,
        fetchActive: {
          ...state.fetchActive,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        active: action.payload.data.user
      };
    case `${SEARCH_USER}_SUCCESS`:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        searched: action.payload.data.users
      };
    case `${FETCH_ACTIVE_USER}_ERROR`:
      return {
        ...state,
        fetchActive: {
          ...state.fetchActive,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    case `${SEARCH_USER}_ERROR`:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        },
        searched: []
      };
    case CHANGE_CHAT_ROOM:
      var chatRoom = action.chatRoom;
      var user = {...state.active};

      if ( chatRoom.data.chatType === 'public' ) {
        user.connectedChatRoom = chatRoom.data._id;
      }

      return {
        ...state,
        active: {...user}
      };
    case SOCKET_BROADCAST_MUTE_MEMBER:
      var memberID = action.memberID;
      var user = {...state.active};

      if ( memberID === user._id ) {
        user.mute.data = true;
      }

      return {
        ...state,
        active: {...user}
      };
    case SOCKET_BROADCAST_UNMUTE_MEMBER:
      var memberID = action.memberID;
      var user = {...state.active};

      if ( memberID === user._id ) {
        user.mute.data = false;
      }

      return {
        ...state,
        active: {...user}
      };
    default:
      return state;
  }
}

export default user;
