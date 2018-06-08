import {
  SOCKET_BROADCAST_IS_TYPING,
  SOCKET_BROADCAST_IS_NOT_TYPING
} from '../constants/typer';
import { CHANGE_CHAT_ROOM } from '../constants/chat-room';

const initialState = {
  activeChatRoom: {
    data: {}
  },
  all: []
};

const typer = (state=initialState, action) => {
  switch(action.type) {
    case SOCKET_BROADCAST_IS_TYPING:
      var typer = action.typer;
      var chatRoomID = action.chatRoomID;
      var activeChatRoom = {...state.activeChatRoom};
      var typers = [...state.all];
      var isTyperExist = false;

      for (var i = 0; i < typers.length; i++) {
        var singleTyper = typers[i];

        if ( singleTyper._id === typer._id ) {
          isTyperExist = true;
          break;
        } else {
          continue
        }
      }

      if ( activeChatRoom.data._id === chatRoomID && !isTyperExist ) {
        typers.push(typer);
      }

      return {
        ...state,
        all: [...typers]
      };
    case SOCKET_BROADCAST_IS_NOT_TYPING:
      var typer = action.typer;
      var chatRoomID = action.chatRoomID;
      var activeChatRoom = {...state.activeChatRoom};
      var typers = [...state.all];

      if ( activeChatRoom.data._id === chatRoomID ) {
        typers = typers.filter(singleTyper =>
          singleTyper._id !== typer._id
        );
      }

      return {
        ...state,
        all: [...typers]
      };
    case CHANGE_CHAT_ROOM:
      return {
        ...state,
        activeChatRoom: action.chatRoom,
        all: []
      };
    default:
      return state;
  }
}

export default typer;
