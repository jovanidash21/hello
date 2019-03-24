import {
  FETCH_NEW_MESSAGES,
  SEND_MESSAGE,
  SOCKET_BROADCAST_SEND_MESSAGE,
  DELETE_MESSAGE,
  SOCKET_BROADCAST_DELETE_MESSAGE
} from '../constants/message';
import { CHANGE_CHAT_ROOM } from '../constants/chat-room';

const commonStateFlags = {
  loading: false,
  success: false,
  error: false,
  message: ''
};

const initialState = {
  fetchNew: {...commonStateFlags},
  delete: {...commonStateFlags},
  activeChatRoom: {
    data: {}
  },
  all: []
};

const message = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_NEW_MESSAGES}_LOADING`:
      var activeChatRoom = {...state.activeChatRoom};
      var chatRoomID = action.meta;

      if ( chatRoomID === activeChatRoom.data._id ) {
        return {
          ...state,
          fetchNew: {
            ...state.fetchNew,
            loading: true
          }
        };
      }

      return {
        ...state
      };
    case `${DELETE_MESSAGE}_LOADING`:
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: true
        }
      };
    case `${FETCH_NEW_MESSAGES}_SUCCESS`:
      var activeChatRoom = {...state.activeChatRoom};
      var chatRoomID = action.meta;

      if ( chatRoomID === activeChatRoom.data._id ) {
        return {
          ...state,
          fetchNew: {
            ...state.fetchNew,
            loading: false,
            success: true,
            error: false,
            message: action.payload.data.message
          },
          all: action.payload.data.messages
        };
      }

      return {
        ...state
      };
    case `${SEND_MESSAGE}_SUCCESS`:
      var messages = [...state.all];
      var activeChatRoom = {...state.activeChatRoom};
      var messageID = action.meta;
      var newMessage = action.payload.data.messageData;

      if ( newMessage.chatRoom === activeChatRoom.data._id ) {
        var messageIndex = messages.findIndex(singleMessage => singleMessage._id === messageID);

        if ( messageIndex > -1 ) {
          newMessage.isSending = false;
          messages[messageIndex] = newMessage;
        }
      }

      return {
        ...state,
        all: [...messages]
      };
    case `${DELETE_MESSAGE}_SUCCESS`:
      var messages = [...state.all];
      var activeChatRoom = {...state.activeChatRoom};
      var messageID = action.meta.messageID;
      var chatRoomID = action.meta.chatRoomID;

      if ( chatRoomID === activeChatRoom.data._id ) {
        messages = messages.filter((message) => message._id !== messageID);
      }

      return {
        ...state,
        delete: {
          ...state.delete,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        },
        all: messages
      };
    case `${FETCH_NEW_MESSAGES}_ERROR`:
      var activeChatRoom = {...state.activeChatRoom};
      var chatRoomID = action.meta;

      if ( chatRoomID === activeChatRoom.data._id ) {
        return {
          ...state,
          fetchNew: {
            ...state.fetchNew,
            loading: false,
            success: false,
            error: true,
            message: action.payload.response.data.message
          }
        };
      }

      return {
        ...state
      };
    case `${DELETE_MESSAGE}_ERROR`:
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        }
      };
    case CHANGE_CHAT_ROOM:
      return {
        ...state,
        activeChatRoom: action.chatRoom
      };
    case SEND_MESSAGE:
    case SOCKET_BROADCAST_SEND_MESSAGE:
      var message = action.message;
      var activeChatRoom = {...state.activeChatRoom};
      var messages = [...state.all];

      if ( message.chatRoom === activeChatRoom.data._id ) {
        messages.push(message);

        if ( messages.length > 20 ) {
          messages = messages.slice(1);
        }
      }

      return {
        ...state,
        all: [...messages]
      };
    case SOCKET_BROADCAST_DELETE_MESSAGE:
      var messageID = action.messageID;
      var chatRoomID = action.chatRoomID;
      var activeChatRoom = {...state.activeChatRoom};
      var messages = [...state.all];

      if ( activeChatRoom.data._id === chatRoomID ) {
        messages = messages.filter((message) => message._id !== messageID);
      }

      return {
        ...state,
        all: [...messages]
      };
    default:
      return state;
  }
}

export default message;
