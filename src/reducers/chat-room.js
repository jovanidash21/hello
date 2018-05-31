import {
  FETCH_CHAT_ROOMS,
  CHANGE_CHAT_ROOM,
  CREATE_CHAT_ROOM,
  SOCKET_CREATE_CHAT_ROOM,
  SOCKET_BROADCAST_CREATE_CHAT_ROOM
} from '../constants/chat-room';
import { SOCKET_BROADCAST_USER_LOGIN } from '../constants/auth';
import {
  SOCKET_BROADCAST_KICK_USER,
  SOCKET_BROADCAST_UNKICK_USER
} from '../constants/user';

const initialState = {
  isLoading: false,
  active: {},
  all: []
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
        all: action.payload.data.chatRooms
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
    case CHANGE_CHAT_ROOM:
      return {
        ...state,
        active: action.chatRoom
      };
    case SOCKET_CREATE_CHAT_ROOM:
    case SOCKET_BROADCAST_CREATE_CHAT_ROOM:
      return {
        ...state,
        all: [
          ...state.all,
          action.chatRoom
        ]
      };
    case SOCKET_BROADCAST_USER_LOGIN:
      var user = action.user;
      var userID = user._id;
      var activeChatRoom = {...state.active};
      var members = activeChatRoom.members;

      if (
        activeChatRoom.chatType === 'public' &&
        members.indexOf(userID) == -1
      ) {
        members.push(userID);
      }

      return {
        ...state,
        active: {...activeChatRoom}
      }
    case SOCKET_BROADCAST_KICK_USER:
      var chatRoomID = action.chatRoomID;
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];

      if ( activeChatRoom._id === chatRoomID ) {
        location.reload();
      }

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
        all: [...chatRooms]
      }
    case SOCKET_BROADCAST_UNKICK_USER:
      var chatRoom = action.chatRoom;
      var chatRooms = [...state.all];

      chatRooms.push(chatRoom);

      return {
        ...state,
        all: [...chatRooms]
      }
    default:
      return state;
  }
}

export default chatRoom;
