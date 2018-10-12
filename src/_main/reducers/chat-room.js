import {
  FETCH_CHAT_ROOMS,
  CHANGE_CHAT_ROOM,
  CREATE_CHAT_ROOM,
  SOCKET_CREATE_CHAT_ROOM,
  SOCKET_BROADCAST_CREATE_CHAT_ROOM,
  TRASH_CHAT_ROOM
} from '../constants/chat-room';
import { SOCKET_BROADCAST_USER_LOGIN } from '../constants/auth';
import {
  FETCH_NEW_MESSAGES,
  SOCKET_BROADCAST_NOTIFY_MESSAGE
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
    case 'private':
      priority = 2;
      break;
    default:
      priority = 3;
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
  trash: {...commonStateFlags},
  active: {
    data: {}
  },
  all: []
};

const chatRoom = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_CHAT_ROOMS}_LOADING`:
      return {
        ...state,
        fetch: {
          ...state.fetch,
          loading: true
        }
      };
    case `${CREATE_CHAT_ROOM}_LOADING`:
      return {
        ...state,
        create: {
          ...state.create,
          loading: true
        }
      };
    case `${TRASH_CHAT_ROOM}_LOADING`:
      return {
        ...state,
        trash: {
          ...state.trash,
          loading: true
        }
      };
    case `${FETCH_CHAT_ROOMS}_SUCCESS`:
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
    case `${CREATE_CHAT_ROOM}_SUCCESS`:
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
    case `${TRASH_CHAT_ROOM}_SUCCESS`:
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
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        all: [...chatRooms]
      };
    case `${FETCH_CHAT_ROOMS}_ERROR`:
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
    case `${CREATE_CHAT_ROOM}_ERROR`:
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
    case `${TRASH_CHAT_ROOM}_ERROR`:
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
    case CHANGE_CHAT_ROOM:
      return {
        ...state,
        active: action.chatRoom
      };
    case SOCKET_CREATE_CHAT_ROOM:
    case SOCKET_BROADCAST_CREATE_CHAT_ROOM:
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
    case SOCKET_BROADCAST_USER_LOGIN:
      var user = action.user;
      var userID = user._id;
      var activeChatRoom = {...state.active};
      var members = activeChatRoom.data.members;

      if (
        activeChatRoom.data.chatType === 'public' &&
        members.indexOf(userID) == -1
      ) {
        members.push(userID);
      }

      return {
        ...state,
        active: {...activeChatRoom}
      }
    case `${FETCH_NEW_MESSAGES}_SUCCESS`:
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if ( chatRoom.data._id === activeChatRoom.data._id ) {
          chatRoom.unReadMessages = 0;
          break;
        } else {
          continue;
        }
      }

      return {
        ...state,
        all: [...chatRooms]
      }
    case SOCKET_BROADCAST_NOTIFY_MESSAGE:
      var activeChatRoom = {...state.active};
      var chatRooms = [...state.all];
      var chatRoomID = action.chatRoomID;

      for (var i = 0; i < chatRooms.length; i++) {
        var chatRoom = chatRooms[i];

        if ( chatRoom.data._id === chatRoomID ) {
          chatRoom.unReadMessages++;
          break;
        } else {
          continue;
        }
      }

      return {
        ...state,
        all: [...chatRooms]
      }
    case SOCKET_BROADCAST_KICK_USER:
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
    case SOCKET_BROADCAST_UNKICK_USER:
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
    default:
      return state;
  }
}

export default chatRoom;
