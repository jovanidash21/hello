import {
  FETCH_NEW_MESSAGES,
  SEND_MESSAGE,
  SOCKET_BROADCAST_SEND_MESSAGE
} from '../constants/message';
import { CHANGE_CHAT_ROOM } from '../constants/chat-room';

const initialState = {
  isFetchingNew: false,
  isFetchingNewSuccess: true,
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
    case `${SEND_MESSAGE}_SUCCESS`:
      var messages = [...state.all];
      var messageID = action.meta;
      var newMessage = action.payload.data.messageData;

      messages = messages.filter((message) => message._id !== messageID);
      newMessage.isSending = false;

      return {
        ...state,
        isSending: false,
        isSendingSuccess: true,
        all: [
          ...messages,
          newMessage
        ]
      };
    case `${FETCH_NEW_MESSAGES}_ERROR`:
      return {
        ...state,
        isFetchingNew: false,
        isFetchingNewSuccess: false
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
      messages = messages.slice(1);

      return {
        ...state,
        all: [...messages]
      };
    default:
      return state;
  }
}

export default message;
