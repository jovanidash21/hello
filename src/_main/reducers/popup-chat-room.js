import {
  OPEN_POPUP_CHAT_ROOM,
  CLOSE_POPUP_CHAT_ROOM
} from '../constants/popup-chat-room';
import {
  FETCH_NEW_MESSAGES,
  SEND_MESSAGE,
  SOCKET_BROADCAST_SEND_MESSAGE,
  DELETE_MESSAGE,
  SOCKET_BROADCAST_DELETE_MESSAGE
} from '../constants/message';
import {
  SOCKET_BROADCAST_USER_LOGIN,
  SOCKET_BROADCAST_USER_LOGOUT
} from '../constants/auth';

const initialState = {
  all: []
};

const popUpChatRoom = (state=initialState, action) => {
  switch(action.type) {
    case OPEN_POPUP_CHAT_ROOM:
      var chatRoom = action.chatRoom;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoom.data._id);

      if ( chatRoomIndex === -1  ) {
        chatRooms.push(chatRoom);
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case CLOSE_POPUP_CHAT_ROOM:
      var chatRoomID = action.chatRoomID;
      var chatRooms = [...state.all];

      chatRooms = chatRooms.filter(singlChatRoom =>
        singlChatRoom.data._id !== chatRoomID
      );

      return {
        ...state,
        all: [...chatRooms]
      };
    case `${FETCH_NEW_MESSAGES}_LOADING`:
      var chatRoomID = action.meta;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].message.fetchNew = {
          ...chatRooms[chatRoomIndex].message.fetchNew,
          loading: true
        };
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case `${FETCH_NEW_MESSAGES}_SUCCESS`:
      var chatRoomID = action.meta;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].message.fetchNew = {
          ...chatRooms[chatRoomIndex].message.fetchNew,
          loading: false,
          success: true,
          error: false,
          message: action.payload.data.message
        };
        chatRooms[chatRoomIndex].message.all = action.payload.data.messages;
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case `${FETCH_NEW_MESSAGES}_ERROR`:
      var chatRoomID = action.meta;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].message.fetchNew = {
          ...chatRooms[chatRoomIndex].message.fetchNew,
          loading: false,
          success: false,
          error: true,
          message: action.payload.response.data.message
        };
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case `${SEND_MESSAGE}_SUCCESS`:
      var messageID = action.meta;
      var newMessage = action.payload.data.messageData;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === newMessage.chatRoom);

      if ( chatRoomIndex > -1 ) {
        var messages = [...chatRooms[chatRoomIndex].message.all];
        var messageIndex = messages.findIndex(singleMessage => singleMessage._id === messageID);

        if ( messageIndex > -1 ) {
          newMessage.isSending = false;
          messages[messageIndex] = newMessage;
        }

        chatRooms[chatRoomIndex].message.all = messages;
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case SEND_MESSAGE:
    case SOCKET_BROADCAST_SEND_MESSAGE:
      var message = action.message;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === message.chatRoom);

      if ( chatRoomIndex > -1 ) {
        var messages = [...chatRooms[chatRoomIndex].message.all];

        messages.push(message);

        if ( messages.length > 20 ) {
          messages = messages.slice(1);
        }

        chatRooms[chatRoomIndex].message.all = messages;
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case `${DELETE_MESSAGE}_SUCCESS`:
      var messageID = action.meta.messageID;
      var chatRoomID = action.meta.chatRoomID;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].message.all = chatRooms[chatRoomIndex].message.all.filter((message) => message._id !== messageID);
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case SOCKET_BROADCAST_DELETE_MESSAGE:
      var messageID = action.messageID;
      var chatRoomID = action.chatRoomID;
      var chatRooms = [...state.all];

      var chatRoomIndex = chatRooms.findIndex(singleChatRoom => singleChatRoom.data._id === chatRoomID);

      if ( chatRoomIndex > -1 ) {
        chatRooms[chatRoomIndex].message.all = chatRooms[chatRoomIndex].message.all.filter((message) => message._id !== messageID);
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case SOCKET_BROADCAST_USER_LOGIN:
      var user = action.user;
      var userID = user._id;
      var chatRooms = [...state.all];

      if ( chatRooms.length > 0 ) {
        for (var i = 0; i < chatRooms.length; i++) {
          var chatRoom = chatRooms[i];
          var members = chatRoom.data.members;

          if ( members.length > 0 ) {
            var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

            if ( memberIndex > -1 ) {
              members[memberIndex].isOnline = true;
            }
          }
        }
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    case SOCKET_BROADCAST_USER_LOGOUT:
      var userID = action.userID;
      var chatRooms = [...state.all];

      if ( chatRooms.length > 0 ) {
        for (var i = 0; i < chatRooms.length; i++) {
          var chatRoom = chatRooms[i];
          var members = chatRoom.data.members;

          if ( members.length > 0 ) {
            var memberIndex = members.findIndex(singleMember => singleMember._id === userID);

            if ( memberIndex > -1 ) {
              members[memberIndex].isOnline = false;
            }
          }
        }
      }

      return {
        ...state,
        all: [...chatRooms]
      };
    default:
      return state;
  }
}

export default popUpChatRoom;
