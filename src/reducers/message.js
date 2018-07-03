import {
  FETCH_NEW_MESSAGES,
  FETCH_OLD_MESSAGES,
  SEND_MESSAGE,
  SOCKET_BROADCAST_SEND_MESSAGE
} from '../constants/message';
import { CHANGE_CHAT_ROOM } from '../constants/chat-room';

const initialState = {
  isFetchingNew: false,
  isFetchingNewSuccess: true,
  isFetchingOld: false,
  isFetchingOldSuccess: true,
  isSending: false,
  isSendingSuccess: true,
  activeChatRoom: {
    data: {}
  },
  all: []
};

const message = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_NEW_MESSAGES}_LOADING`:
      return {
        ...state,
        isFetchingNew: true
      };
    case `${FETCH_OLD_MESSAGES}_LOADING`:
      return {
        ...state,
        isFetchingOld: true
      };
    case `${SEND_MESSAGE}_LOADING`:
      return {
        ...state,
        isSending: true,
      };
    case `${FETCH_NEW_MESSAGES}_SUCCESS`:
      return {
        ...state,
        isFetchingNew: false,
        isFetchingNewSuccess: true,
        all: action.payload.data
      };
    case `${FETCH_OLD_MESSAGES}_SUCCESS`:
      return {
        ...state,
        isFetchingOld: false,
        isFetchingOldSuccess: true,
        all: [
          ...action.payload.data,
          ...state.all
        ]
      };
    case `${SEND_MESSAGE}_SUCCESS`:
      return {
        ...state,
        isSending: false,
        isSendingSuccess: true,
        all: [
          ...state.all.filter((messageData) => messageData.newMessageID !== action.meta),
          action.payload.data.messageData
        ]
      };
    case `${FETCH_NEW_MESSAGES}_ERROR`:
      return {
        ...state,
        isFetchingNew: false,
        isFetchingNewSuccess: false
      };
    case `${FETCH_OLD_MESSAGES}_ERROR`:
      return {
        ...state,
        isFetchingOld: false,
        isFetchingOldSuccess: false
      };
    case `${SEND_MESSAGE}_ERROR`:
      return {
        ...state,
        isSending: false,
        isSendingSuccess: false
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

      if (message.chatRoom === activeChatRoom.data._id) {
        messages.push(message);
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
