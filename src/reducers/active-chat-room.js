import { SOCKET_BROADCAST_KICK_USER } from '../constants/user';
import { CHANGE_CHAT_ROOM } from '../constants/active-chat-room';

const initialState = {
  chatRoomData: {}
};

const activeChatRoom = (state=initialState, action) => {
  switch(action.type) {
    case SOCKET_BROADCAST_KICK_USER:
      var chatRoomID = action.chatRoom;
      var chatRoomData = {...state.chatRoomData};

      if ( chatRoomData._id === chatRoomID ) {
        location.reload();
      }

      return {
        ...state
      }
    case CHANGE_CHAT_ROOM:
      return {
        chatRoomData: action.payload
      };
    default:
      return state;
  }
}

export default activeChatRoom;
