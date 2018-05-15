import {
  FETCH_CHAT_ROOMS,
  CREATE_CHAT_ROOM,
  SOCKET_BROADCAST_CREATE_CHAT_ROOM
} from '../constants/chat-room';

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
        isCreateChatRoomSuccess: true,
        chatRooms: [
          ...state.chatRooms,
          action.payload.data.chatRoomData
        ]
      };
    case `${FETCH_CHAT_ROOMS}_ERROR`:
    case `${CREATE_CHAT_ROOM}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case SOCKET_BROADCAST_CREATE_CHAT_ROOM:
      return {
        ...state,
        chatRooms: [
          ...state.chatRooms,
          action.chatRoom
        ]
      };
    default:
      return state;
  }
}

export default chatRoom;
